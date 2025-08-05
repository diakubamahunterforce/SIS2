import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: ['*'],
  allowHeaders: ['*'],
  allowMethods: ['*'],
}));
app.use('*', logger(console.log));

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Auth middleware for protected routes
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Token de acesso não fornecido' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (!user?.id || error) {
    return c.json({ error: 'Token de acesso inválido' }, 401);
  }

  c.set('userId', user.id);
  c.set('userEmail', user.email);
  await next();
};

// Log de ações
const logAction = async (userId: string, acao: string, detalhes?: string) => {
  const logEntry = {
    id: crypto.randomUUID(),
    policialId: userId,
    acao,
    timestamp: new Date().toISOString(),
    detalhes
  };

  await kv.set(`log:${logEntry.id}`, logEntry);
  console.log('Action logged:', logEntry);
};

// ========== ROTAS DE AUTENTICAÇÃO ==========

// Criar usuário policial
app.post('/make-server-bec4bad8/auth/signup', async (c) => {
  try {
    const { email, password, nome, posto, matricula } = await c.req.json();

    if (!email || !password || !nome || !posto || !matricula) {
      return c.json({ error: 'Todos os campos são obrigatórios' }, 400);
    }

    // Verificar se matrícula já existe
    const existingPolicial = await kv.get(`policial:matricula:${matricula}`);
    if (existingPolicial) {
      return c.json({ error: 'Matrícula já cadastrada' }, 409);
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { nome, posto, matricula },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.log('Auth error:', authError);
      return c.json({ error: `Erro ao criar usuário: ${authError.message}` }, 400);
    }

    // Salvar dados do policial
    const policial = {
      id: authData.user.id,
      nome,
      posto,
      matricula,
      email,
      criadoEm: new Date().toISOString()
    };

    await kv.set(`policial:${authData.user.id}`, policial);
    await kv.set(`policial:matricula:${matricula}`, authData.user.id);

    // Log da ação
    await logAction(authData.user.id, 'POLICIAL_CRIADO', `Novo policial: ${nome} - ${posto} - ${matricula}`);

    return c.json({ 
      message: 'Policial cadastrado com sucesso',
      policial: { id: policial.id, nome, posto, matricula }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// Login de policial
app.post('/make-server-bec4bad8/auth/login', async (c) => {
  try {
    const { matricula, password } = await c.req.json();

    if (!matricula || !password) {
      return c.json({ error: 'Matrícula e senha são obrigatórios' }, 400);
    }

    // Buscar policial pela matrícula
    const policialId = await kv.get(`policial:matricula:${matricula}`);
    if (!policialId) {
      return c.json({ error: 'Matrícula não encontrada' }, 404);
    }

    const policial = await kv.get(`policial:${policialId}`);
    if (!policial) {
      return c.json({ error: 'Dados do policial não encontrados' }, 404);
    }

    // Tentar fazer login com email
    const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
      email: policial.email,
      password
    });

    if (loginError) {
      console.log('Login error:', loginError);
      return c.json({ error: 'Credenciais inválidas' }, 401);
    }

    // Log da ação
    await logAction(policial.id, 'LOGIN', `Login realizado: ${policial.nome}`);

    return c.json({
      message: 'Login realizado com sucesso',
      access_token: sessionData.session.access_token,
      policial: {
        id: policial.id,
        nome: policial.nome,
        posto: policial.posto,
        matricula: policial.matricula
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// ========== ROTAS DE BOLETINS ==========

// Listar boletins
app.get('/make-server-bec4bad8/boletins', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const boletins = await kv.getByPrefix('boletim:');

    // Log da ação
    await logAction(userId, 'CONSULTA_BOLETINS', 'Listagem de boletins');

    return c.json({ boletins });
  } catch (error) {
    console.error('Get boletins error:', error);
    return c.json({ error: 'Erro ao buscar boletins' }, 500);
  }
});

// Criar novo boletim
app.post('/make-server-bec4bad8/boletins', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const boletimData = await c.req.json();

    // Validações básicas
    if (!boletimData.numeroBoletim || !boletimData.tipoOcorrencia || !boletimData.local || !boletimData.descricao) {
      return c.json({ error: 'Campos obrigatórios não preenchidos' }, 400);
    }

    // Verificar se número do boletim já existe
    const existingBoletim = await kv.get(`boletim:numero:${boletimData.numeroBoletim}`);
    if (existingBoletim) {
      return c.json({ error: 'Número do boletim já existe' }, 409);
    }

    const boletim = {
      id: crypto.randomUUID(),
      ...boletimData,
      policialId: userId,
      status: 'registrado',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    await kv.set(`boletim:${boletim.id}`, boletim);
    await kv.set(`boletim:numero:${boletim.numeroBoletim}`, boletim.id);

    // Log da ação
    await logAction(userId, 'BOLETIM_CRIADO', `B.O. ${boletim.numeroBoletim} - ${boletim.tipoOcorrencia}`);

    return c.json({ 
      message: 'Boletim criado com sucesso',
      boletim
    });

  } catch (error) {
    console.error('Create boletim error:', error);
    return c.json({ error: 'Erro ao criar boletim' }, 500);
  }
});

// Buscar boletim por ID
app.get('/make-server-bec4bad8/boletins/:id', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const boletimId = c.req.param('id');

    const boletim = await kv.get(`boletim:${boletimId}`);
    if (!boletim) {
      return c.json({ error: 'Boletim não encontrado' }, 404);
    }

    // Log da ação
    await logAction(userId, 'CONSULTA_BOLETIM', `B.O. ${boletim.numeroBoletim}`);

    return c.json({ boletim });
  } catch (error) {
    console.error('Get boletim error:', error);
    return c.json({ error: 'Erro ao buscar boletim' }, 500);
  }
});

// Atualizar boletim
app.put('/make-server-bec4bad8/boletins/:id', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const boletimId = c.req.param('id');
    const updateData = await c.req.json();

    const boletim = await kv.get(`boletim:${boletimId}`);
    if (!boletim) {
      return c.json({ error: 'Boletim não encontrado' }, 404);
    }

    const boletimAtualizado = {
      ...boletim,
      ...updateData,
      atualizadoEm: new Date().toISOString()
    };

    await kv.set(`boletim:${boletimId}`, boletimAtualizado);

    // Log da ação
    await logAction(userId, 'BOLETIM_ATUALIZADO', `B.O. ${boletim.numeroBoletim} atualizado`);

    return c.json({ 
      message: 'Boletim atualizado com sucesso',
      boletim: boletimAtualizado
    });

  } catch (error) {
    console.error('Update boletim error:', error);
    return c.json({ error: 'Erro ao atualizar boletim' }, 500);
  }
});

// ========== ROTAS DE PESSOAS ==========

// Listar pessoas
app.get('/make-server-bec4bad8/pessoas', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const pessoas = await kv.getByPrefix('pessoa:');

    // Log da ação
    await logAction(userId, 'CONSULTA_PESSOAS', 'Listagem de pessoas');

    return c.json({ pessoas });
  } catch (error) {
    console.error('Get pessoas error:', error);
    return c.json({ error: 'Erro ao buscar pessoas' }, 500);
  }
});

// Criar nova pessoa
app.post('/make-server-bec4bad8/pessoas', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const pessoaData = await c.req.json();

    if (!pessoaData.nome || !pessoaData.tipo) {
      return c.json({ error: 'Nome e tipo são obrigatórios' }, 400);
    }

    const pessoa = {
      id: crypto.randomUUID(),
      ...pessoaData,
      criadaEm: new Date().toISOString()
    };

    await kv.set(`pessoa:${pessoa.id}`, pessoa);

    // Log da ação
    await logAction(userId, 'PESSOA_CRIADA', `${pessoa.nome} - ${pessoa.tipo}`);

    return c.json({ 
      message: 'Pessoa cadastrada com sucesso',
      pessoa
    });

  } catch (error) {
    console.error('Create pessoa error:', error);
    return c.json({ error: 'Erro ao cadastrar pessoa' }, 500);
  }
});

// Atualizar pessoa
app.put('/make-server-bec4bad8/pessoas/:id', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const pessoaId = c.req.param('id');
    const updateData = await c.req.json();

    const pessoa = await kv.get(`pessoa:${pessoaId}`);
    if (!pessoa) {
      return c.json({ error: 'Pessoa não encontrada' }, 404);
    }

    const pessoaAtualizada = {
      ...pessoa,
      ...updateData,
      atualizadaEm: new Date().toISOString()
    };

    await kv.set(`pessoa:${pessoaId}`, pessoaAtualizada);

    // Log da ação
    await logAction(userId, 'PESSOA_ATUALIZADA', `${pessoa.nome} atualizado`);

    return c.json({ 
      message: 'Pessoa atualizada com sucesso',
      pessoa: pessoaAtualizada
    });

  } catch (error) {
    console.error('Update pessoa error:', error);
    return c.json({ error: 'Erro ao atualizar pessoa' }, 500);
  }
});

// Deletar pessoa
app.delete('/make-server-bec4bad8/pessoas/:id', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const pessoaId = c.req.param('id');

    const pessoa = await kv.get(`pessoa:${pessoaId}`);
    if (!pessoa) {
      return c.json({ error: 'Pessoa não encontrada' }, 404);
    }

    await kv.del(`pessoa:${pessoaId}`);

    // Log da ação
    await logAction(userId, 'PESSOA_DELETADA', `${pessoa.nome} removido do sistema`);

    return c.json({ message: 'Pessoa deletada com sucesso' });

  } catch (error) {
    console.error('Delete pessoa error:', error);
    return c.json({ error: 'Erro ao deletar pessoa' }, 500);
  }
});

// ========== ROTAS DE POLICIAIS ==========

// Listar policiais
app.get('/make-server-bec4bad8/policiais', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const policiais = await kv.getByPrefix('policial:');
    
    // Filtrar apenas os dados principais (não incluir índices)
    const policiaisLimpos = policiais.filter(p => p && typeof p === 'object' && p.id && p.nome);

    // Log da ação
    await logAction(userId, 'CONSULTA_POLICIAIS', 'Listagem de policiais');

    return c.json({ policiais: policiaisLimpos });
  } catch (error) {
    console.error('Get policiais error:', error);
    return c.json({ error: 'Erro ao buscar policiais' }, 500);
  }
});

// ========== ROTAS DE RELATÓRIOS ==========

// Estatísticas gerais
app.get('/make-server-bec4bad8/relatorios/estatisticas', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const boletins = await kv.getByPrefix('boletim:');
    
    // Filtrar apenas boletins válidos (não índices)
    const boletinsValidos = boletins.filter(b => b && typeof b === 'object' && b.id && b.numeroBoletim);

    // Calcular estatísticas
    const estatisticas = {
      totalBoletins: boletinsValidos.length,
      porTipo: {},
      porStatus: {},
      ultimosDias: {}
    };

    boletinsValidos.forEach(boletim => {
      // Por tipo
      const tipo = boletim.tipoOcorrencia || 'outros';
      estatisticas.porTipo[tipo] = (estatisticas.porTipo[tipo] || 0) + 1;

      // Por status
      const status = boletim.status || 'registrado';
      estatisticas.porStatus[status] = (estatisticas.porStatus[status] || 0) + 1;

      // Por data (últimos 7 dias)
      if (boletim.dataHoraOcorrencia) {
        const data = new Date(boletim.dataHoraOcorrencia).toISOString().split('T')[0];
        estatisticas.ultimosDias[data] = (estatisticas.ultimosDias[data] || 0) + 1;
      }
    });

    // Log da ação
    await logAction(userId, 'CONSULTA_ESTATISTICAS', 'Relatório de estatísticas gerado');

    return c.json({ estatisticas });

  } catch (error) {
    console.error('Get estatisticas error:', error);
    return c.json({ error: 'Erro ao gerar estatísticas' }, 500);
  }
});

// Busca avançada de boletins
app.post('/make-server-bec4bad8/boletins/buscar', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const filtros = await c.req.json();
    
    let boletins = await kv.getByPrefix('boletim:');
    
    // Filtrar apenas boletins válidos
    boletins = boletins.filter(b => b && typeof b === 'object' && b.id && b.numeroBoletim);

    // Aplicar filtros
    if (filtros.numeroBoletim) {
      boletins = boletins.filter(b => 
        b.numeroBoletim.toLowerCase().includes(filtros.numeroBoletim.toLowerCase())
      );
    }

    if (filtros.tipoOcorrencia) {
      boletins = boletins.filter(b => b.tipoOcorrencia === filtros.tipoOcorrencia);
    }

    if (filtros.status) {
      boletins = boletins.filter(b => b.status === filtros.status);
    }

    if (filtros.dataInicio && filtros.dataFim) {
      boletins = boletins.filter(b => {
        const dataOcorrencia = new Date(b.dataHoraOcorrencia);
        const inicio = new Date(filtros.dataInicio);
        const fim = new Date(filtros.dataFim);
        return dataOcorrencia >= inicio && dataOcorrencia <= fim;
      });
    }

    // Log da ação
    await logAction(userId, 'BUSCA_AVANCADA', `Busca com filtros: ${JSON.stringify(filtros)}`);

    return c.json({ 
      boletins,
      total: boletins.length
    });

  } catch (error) {
    console.error('Search boletins error:', error);
    return c.json({ error: 'Erro na busca de boletins' }, 500);
  }
});

// ========== ROTAS DE LOGS ==========

// Buscar logs de auditoria
app.get('/make-server-bec4bad8/logs', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const logs = await kv.getByPrefix('log:');

    // Ordenar por timestamp decrescente
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Log da ação
    await logAction(userId, 'CONSULTA_LOGS', 'Consulta de logs de auditoria');

    return c.json({ logs: logs.slice(0, 100) }); // Últimos 100 logs
  } catch (error) {
    console.error('Get logs error:', error);
    return c.json({ error: 'Erro ao buscar logs' }, 500);
  }
});

// Health check
app.get('/make-server-bec4bad8/health', (c) => {
  return c.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

Deno.serve(app.fetch);