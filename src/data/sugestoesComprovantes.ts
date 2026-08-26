export interface SugestaoDocumental {
  id: string;
  itemReferencia: string;
  pontosSugeridos: number;
  unidadeSugerida: string;
  pontosMaximos: number;
  tituloAtividade: string;
  descricaoExemplo: string;
  documentosAceitos: string[];
  requisitosEssenciais: string[];
  dicaComissao: string;
  alertaIndeferimento?: string;
}

export interface EixoSugestoes {
  eixoKey: string;
  eixoNome: string;
  anexo: string;
  fundamentoLegal: string;
  pontuacaoMaximaEixo: string;
  resumoEixo: string;
  sugestoes: SugestaoDocumental[];
}

export const SUGESTOES_POR_EIXO: Record<string, EixoSugestoes> = {
  'I - Comissões e Grupos de Trabalho': {
    eixoKey: 'I - Comissões e Grupos de Trabalho',
    eixoNome: 'Requisito I: Comissões, Colegiados e Grupos de Trabalho',
    anexo: 'Anexo I - Resolução CS/IFS nº 394/2026',
    fundamentoLegal: 'Decreto nº 13.048/2026 e Art. 7º da Resolução 394/2026',
    pontuacaoMaximaEixo: '30,00 pontos',
    resumoEixo:
      'Participação em comissões institucionais, colegiados superiores, comitês temáticos, bancas de concursos, PAD/Sindicâncias e representações técnicas formais.',
    sugestoes: [
      {
        id: 'sug-i-1',
        itemReferencia: 'Anexo I, Item 2 e 3 (Comissões e Grupos de Trabalho)',
        pontosSugeridos: 3.0,
        unidadeSugerida: 'Por designação',
        pontosMaximos: 30.0,
        tituloAtividade: 'Membro Titular ou Presidente de Comissão / Grupo de Trabalho',
        descricaoExemplo:
          'Membro titular ou presidente em comissão regularmente constituída (ex: Comissão de Inventário, CIS-PCCTAE, Comissão de Avaliação, NDE ou GT Institucional).',
        documentosAceitos: [
          'Portaria de designação publicada no Boletim de Serviço do IFS ou DOU',
          'Ata de instalação e atas de reuniões ordinárias registradas no SEI',
          'Relatório final de atividades homologado pela autoridade competente',
          'Declaração formal emitida pela DGP ou Pró-Reitoria de vinculação',
        ],
        requisitosEssenciais: [
          'A portaria deve indicar expressamente o nome e SIAPE do servidor',
          'Deve constar vigência, encargo (titular, coordenador ou presidente)',
          'Comissões de curso ou comissões permanentes exigem comprovação de atuação efetiva',
        ],
        dicaComissao:
          'Recomenda-se anexar a portaria de designação acompanhada do relatório conclusivo ou ata para certificar a efetiva prestação dos trabalhos.',
        alertaIndeferimento:
          'Designações informais ou sem ato formal assinado pela autoridade delegada são indeferidas pela CRSC.',
      },
      {
        id: 'sug-i-2',
        itemReferencia: 'Anexo I, Item 1 (Conselhos Superiores e Colegiados)',
        pontosSugeridos: 3.0,
        unidadeSugerida: 'Por ano ou fração > 6 meses',
        pontosMaximos: 15.0,
        tituloAtividade: 'Membro de Conselho Superior / Conselho de Ensino / Colegiado',
        descricaoExemplo:
          'Membro eleito ou designado de órgão colegiado superior da IFE (Conselho Superior - CS, Conselho de Ensino, Pesquisa e Extensão - CONSEPE ou Conselho de Campus).',
        documentosAceitos: [
          'Portaria de homologação de resultado eleitoral ou ato de posse',
          'Atas de sessões com lista de presenças registradas no SEI/IFS',
          'Certidão da Secretaria dos Colegiados Superiores com período de mandato',
        ],
        requisitosEssenciais: [
          'Mínimo de 6 meses de efetivo mandato para cômputo da fração anual',
          'Indicação clara da representação da categoria técnico-administrativa',
        ],
        dicaComissao: 'Solicite certidão circunstanciada à Secretaria do Conselho Superior (SOCS).',
      },
      {
        id: 'sug-i-3',
        itemReferencia: 'Anexo I, Item 4 (Comissão de PAD, Sindicância ou Tomada de Contas)',
        pontosSugeridos: 3.0,
        unidadeSugerida: 'Por designação',
        pontosMaximos: 15.0,
        tituloAtividade: 'Comissão de Processo Administrativo Disciplinar (PAD) / Sindicância',
        descricaoExemplo:
          'Atuação como presidente, membro ou defensor dativo em Comissão de PAD, Sindicância Acusatória ou Tomada de Contas Especial.',
        documentosAceitos: [
          'Portaria da Corregedoria / Reitoria de instauração da comissão',
          'Atestado de conclusão do processo emitido pela Corregedoria Seccional do IFS',
          'Termo de encerramento do processo com número do processo SEI',
        ],
        requisitosEssenciais: [
          'Respeito ao sigilo legal dos autos, anexando apenas atos ordinatórios públicos e atestado funcional da comissão',
        ],
        dicaComissao: 'Peça à Corregedoria uma certidão genérica de atuação sem quebra de sigilo.',
      },
      {
        id: 'sug-i-4',
        itemReferencia: 'Anexo I, Item 5 e 6 (Bancas, Concursos e Vestibulares)',
        pontosSugeridos: 4.5,
        unidadeSugerida: 'Por designação',
        pontosMaximos: 18.0,
        tituloAtividade: 'Banca Examinadora, Fiscalização ou Execução de Concursos/Processos Seletivos',
        descricaoExemplo:
          'Membro de banca examinadora, equipe de fiscalização, coordenação de polo ou elaboração/revisão de provas de concursos públicos ou processos seletivos do IFS.',
        documentosAceitos: [
          'Portaria de designação da Comissão Geral de Concursos/Processos Seletivos',
          'Declaração oficial emitida pelo Departamento de Seleção / PROEN / DGP',
          'Comprovante de convocação e termo de encerramento das atividades de aplicação',
        ],
        requisitosEssenciais: ['Indicação da edição do concurso/vestibular e papel exercido'],
        dicaComissao: 'Atividades remuneradas via GEGRH/GECC podem ser pontuadas se houver portaria formal.',
      },
    ],
  },

  'II - Projetos, Pesquisa e Extensão': {
    eixoKey: 'II - Projetos, Pesquisa e Extensão',
    eixoNome: 'Requisito II: Projetos Institucionais, Apoio ao Ensino, Pesquisa e Extensão',
    anexo: 'Anexo II - Resolução CS/IFS nº 394/2026',
    fundamentoLegal: 'Decreto nº 13.048/2026 e Art. 7º da Resolução 394/2026',
    pontuacaoMaximaEixo: '40,00 pontos',
    resumoEixo:
      'Coordenação ou participação técnica em projetos de ensino, pesquisa, extensão e inovação, comissões de PPCs, tutoria de bolsistas, produção de manuais técnicos e capacitações.',
    sugestoes: [
      {
        id: 'sug-ii-1',
        itemReferencia: 'Anexo II, Item 1 e 2 (Coordenação ou Participação em Projetos)',
        pontosSugeridos: 7.5,
        unidadeSugerida: 'Por projeto homologado',
        pontosMaximos: 30.0,
        tituloAtividade: 'Coordenação ou Colaboração Técnica em Projetos Institucionais',
        descricaoExemplo:
          'Coordenação ou participação em projetos de extensão (PIBIEX), pesquisa (PIBIC/PIBITI) ou ensino cadastrados no SIGAA ou fomento institucional.',
        documentosAceitos: [
          'Certificado ou Declaração oficial emitida pela PROPEX, PROPPI ou PROEN',
          'Comprovante de homologação do projeto no sistema institucional (SIGAA)',
          'Relatório final aprovado pelo comitê de ética ou comitê assessor',
        ],
        requisitosEssenciais: [
          'Carga horária e vigência detalhadas no documento',
          'Papel do servidor especificado (coordenador ou participante técnico)',
        ],
        dicaComissao: 'Projetos institucionais de gestão e inovação de processos também pontuam neste item.',
      },
      {
        id: 'sug-ii-2',
        itemReferencia: 'Anexo II, Item 5 (Tutoria e Supervisão de Bolsistas/Estagiários)',
        pontosSugeridos: 3.0,
        unidadeSugerida: 'Por designação/semestre',
        pontosMaximos: 15.0,
        tituloAtividade: 'Orientação, Supervisão ou Tutoria de Bolsistas e Estagiários',
        descricaoExemplo:
          'Supervisão técnica de estagiários remunerados/obrigatórios ou tutoria de bolsistas de projetos institucionais no setor de lotação.',
        documentosAceitos: [
          'Termo de compromisso de estágio com indicação do supervisor do IFS',
          'Declaração emitida pela Coordenação de Estágio / Direção do Campus',
          'Relatórios semestrais de avaliação do estagiário com visto do supervisor',
        ],
        requisitosEssenciais: ['Período de supervisão e nome do estudante supervisionado'],
        dicaComissao: 'Anexe a declaração emitida pelo setor de integração escola-empresa/estágios.',
      },
      {
        id: 'sug-ii-3',
        itemReferencia: 'Anexo II, Item 6 (Material Técnico e Manuais de Referência)',
        pontosSugeridos: 3.0,
        unidadeSugerida: 'Por produto técnico',
        pontosMaximos: 15.0,
        tituloAtividade: 'Elaboração de Manual Técnico de Procedimentos, Roteiros ou Guias',
        descricaoExemplo:
          'Autoria ou reformulação substancial de manuais de procedimentos operacionais padrão (POP), guias do usuário, rotinas setoriais ou documentos de acessibilidade.',
        documentosAceitos: [
          'Portaria de aprovação ou homologação do manual/guia pela Reitoria/Diretoria',
          'Cópia da capa, sumário e folha de créditos técnicos com autoria no SEI',
          'Despacho da Pró-Reitoria atestando a adoção institucional do manual',
        ],
        requisitosEssenciais: ['Comprovação formal de autoria e homologação por autoridade'],
        dicaComissao: 'Indique o processo SEI de elaboração e homologação do documento normativo.',
      },
      {
        id: 'sug-ii-4',
        itemReferencia: 'Anexo II, Item 9 e 11 (Capacitação e Desenvolvimento de Competências)',
        pontosSugeridos: 1.0,
        unidadeSugerida: 'Por capacitação (mín. 10h)',
        pontosMaximos: 10.0,
        tituloAtividade: 'Cursos de Formação Continuada / Aperfeiçoamento (mínimo 10h)',
        descricaoExemplo:
          'Certificados de cursos em escolas de governo (ENAP, ILB, TCU) ou instituições de ensino superior não utilizados em Incentivo à Qualificação formal.',
        documentosAceitos: [
          'Certificado oficial com código de autenticidade digital e carga horária (mín. 10h)',
          'Conteúdo programático anexo ao certificado',
        ],
        requisitosEssenciais: [
          'Não pode ser curso já aproveitado para concessão de progressão por capacitação ou IQ formal (vedação a bis in idem)',
        ],
        dicaComissao: 'Certificados emitidos pela Escola Virtual de Governo (EV.G/ENAP) são amplamente aceitos.',
      },
    ],
  },

  'III - Premiações e Reconhecimento': {
    eixoKey: 'III - Premiações e Reconhecimento',
    eixoNome: 'Requisito III: Premiações e Reconhecimento Público por Projetos',
    anexo: 'Anexo III - Resolução CS/IFS nº 394/2026',
    fundamentoLegal: 'Decreto nº 13.048/2026 e Art. 7º da Resolução 394/2026',
    pontuacaoMaximaEixo: '40,00 pontos',
    resumoEixo:
      'Premiações públicas municipais, estaduais, nacionais ou internacionais, homenagens institucionais e elogios funcionais publicados em boletim oficial.',
    sugestoes: [
      {
        id: 'sug-iii-1',
        itemReferencia: 'Anexo III, Item 3 (Elogio Formal ou Premiação Institucional)',
        pontosSugeridos: 7.5,
        unidadeSugerida: 'Por prêmio / elogio',
        pontosMaximos: 30.0,
        tituloAtividade: 'Portaria de Elogio Funcional ou Premiação de Âmbito Institucional',
        descricaoExemplo:
          'Elogio formal publicado em Boletim de Serviço ou DOU por desempenho extraordinário, superação de metas ou contribuição institucional expressiva.',
        documentosAceitos: [
          'Portaria de Elogio Funcional assinada pelo Reitor(a) ou Diretor(a)-Geral',
          'Extrato de Assentamento Funcional do SouGov / SIAPE comprovando o registro',
          'Certificado de Menção Honrosa ou Prêmio Institucional de Boas Práticas',
        ],
        requisitosEssenciais: [
          'Deve haver menção expressa aos motivos do elogio ou vínculo ao projeto exitoso',
          'Publicação oficial em veículo regulamentar',
        ],
        dicaComissao: 'Extratos de assentamento individual emitidos pela DGP corroboram a tempestividade da portaria.',
      },
      {
        id: 'sug-iii-2',
        itemReferencia: 'Anexo III, Item 2 (Premiação Nacional)',
        pontosSugeridos: 15.0,
        unidadeSugerida: 'Por prêmio',
        pontosMaximos: 30.0,
        tituloAtividade: 'Prêmio de Âmbito Nacional por Projeto na Gestão Pública',
        descricaoExemplo:
          'Premiação nacional outorgada por órgãos como ENAP (Inovação no Setor Público), MEC, CONIF, TCU, CNPq ou ministérios setoriais.',
        documentosAceitos: [
          'Diploma / Certificado oficial da premiação com chancela do órgão concedente',
          'Publicação no Diário Oficial da União com homologação do resultado',
          'Atestado de autoria ou coautoria do projeto premiado emitido pelo IFS',
        ],
        requisitosEssenciais: ['Comprovação inequívoca do papel do servidor no projeto premiado'],
        dicaComissao: 'Inclua o link e extrato de homologação no DOU para validação expedita.',
      },
    ],
  },

  'IV - Responsabilidades e Contratos': {
    eixoKey: 'IV - Responsabilidades e Contratos',
    eixoNome: 'Requisito IV: Responsabilidades Técnicas, Contratos e Sistemas Estruturantes',
    anexo: 'Anexo IV - Resolução CS/IFS nº 394/2026',
    fundamentoLegal: 'Decreto nº 13.048/2026 e Art. 7º da Resolução 394/2026',
    pontuacaoMaximaEixo: '50,00 pontos',
    resumoEixo:
      'Operação de sistemas estruturantes federais (SIAFI, SCDP, SIASG), fiscalização e gestão de contratos continuados, equipes de planejamento da contratação (TR/ETP) e responsabilidade por setores sem FG.',
    sugestoes: [
      {
        id: 'sug-iv-1',
        itemReferencia: 'Anexo IV, Item 3 (Gestão e Fiscalização de Contratos e Convênios)',
        pontosSugeridos: 4.5,
        unidadeSugerida: 'Por contrato fiscalizado',
        pontosMaximos: 50.0,
        tituloAtividade: 'Gestor ou Fiscal Titular/Técnico de Contrato Administrativo',
        descricaoExemplo:
          'Fiscalização administrativa, técnica ou setorial continuada de contratos de prestação de serviços continuados, TIC, obras, transporte, vigilância ou limpeza.',
        documentosAceitos: [
          'Portaria de designação de Gestor / Fiscal de Contrato publicada no Boletim de Serviço',
          'Termo de Contrato assinado com identificação do número e objeto',
          'Atestes periódicos de notas fiscais ou relatórios de fiscalização no SEI',
          'Declaração consolidada emitida pelo Departamento de Gestão de Contratos / PROAD',
        ],
        requisitosEssenciais: [
          'A portaria deve individualizar o número do contrato e papel desempenhado (fiscal titular, técnico ou administrativo)',
          'Fiscalizações distintas de contratos diferentes pontuam cumulativamente até o teto',
        ],
        dicaComissao:
          'Anexe o bloco de portarias individualizadas junto ao extrato do painel de contratos da PROAD para cômputo integral.',
      },
      {
        id: 'sug-iv-2',
        itemReferencia: 'Anexo IV, Item 1 (Sistemas Estruturantes Federais)',
        pontosSugeridos: 4.5,
        unidadeSugerida: 'Por sistema operado',
        pontosMaximos: 15.0,
        tituloAtividade: 'Operação, Gestão ou Auditoria em Sistemas Estruturantes de Governo',
        descricaoExemplo:
          'Operação qualificada de sistemas estruturantes federais: SIAFI, SCDP, SIASG/Comprasnet, SIGAA, SEI (Administrador), SOUGOV, CGU-PAD, e-MEC ou Plataforma For.',
        documentosAceitos: [
          'Portaria de concessão de perfil de conformista, operador ou cadastrador institucional',
          'Declaração emitida pela PROAD, DGP ou DTI atestando a operação contínua do sistema',
          'Comprovante de perfil ativo no HOD/SIAFI ou extrato de transações de conformidade no sistema',
        ],
        requisitosEssenciais: [
          'A operação deve exigir capacitação técnica e responsabilidade funcional institucional',
        ],
        dicaComissao: 'SIAFI, SCDP, SIASG e Comprasnet possuem pontuação destacada com base no Anexo IV, item 1.',
      },
      {
        id: 'sug-iv-3',
        itemReferencia: 'Anexo IV, Item 2 (Equipe de Planejamento da Contratação / TR / ETP)',
        pontosSugeridos: 3.0,
        unidadeSugerida: 'Por designação',
        pontosMaximos: 15.0,
        tituloAtividade: 'Equipe de Planejamento da Contratação (Estudo Técnico Preliminar e TR)',
        descricaoExemplo:
          'Elaboração de Termo de Referência (TR), Estudo Técnico Preliminar (ETP), Mapa de Riscos ou pesquisa de preços para processos licitatórios institucionais.',
        documentosAceitos: [
          'Portaria de designação da Equipe de Planejamento da Contratação (EPC)',
          'Cópia do TR ou ETP juntado aos autos do processo licitatório no SEI com assinatura do servidor',
          'Despacho da autoridade competente aprovando o termo de referência',
        ],
        requisitosEssenciais: ['Processo de contratação autuado no SEI com indicação da portaria de EPC'],
        dicaComissao: 'Indique o número do processo SEI e da licitação correspondente.',
      },
      {
        id: 'sug-iv-4',
        itemReferencia: 'Anexo IV, Item 8 (Responsável por Setor / Unidade sem FG/CD)',
        pontosSugeridos: 4.5,
        unidadeSugerida: 'Por ano ou fração > 6 meses',
        pontosMaximos: 18.0,
        tituloAtividade: 'Responsável Formal por Setor ou Unidade Desprovida de Função Gratificada',
        descricaoExemplo:
          'Designação formal para responder pela coordenação, gerência ou chefia de setor ou serviço sem percepção de remuneração de FG ou CD.',
        documentosAceitos: [
          'Portaria de designação de responsável pelo setor assinada pelo Reitor ou Diretor-Geral',
          'Declaração da DGP atestando o período de titularidade sem vinculação a FG/CD',
        ],
        requisitosEssenciais: ['Comprovação de ausência de recebimento concomitante de FG para o mesmo encargo'],
        dicaComissao: 'Muito comum em setores como protocolo, arquivo, almoxarifado ou laboratórios de campus.',
      },
    ],
  },

  'V - Cargos e Funções de Direção/Chefia': {
    eixoKey: 'V - Cargos e Funções de Direção/Chefia',
    eixoNome: 'Requisito V: Exercício de Cargos de Direção (CD) e Funções Gratificadas (FG)',
    anexo: 'Anexo V - Resolução CS/IFS nº 394/2026',
    fundamentoLegal: 'Decreto nº 13.048/2026 e Art. 7º da Resolução 394/2026',
    pontuacaoMaximaEixo: '45,00 pontos',
    resumoEixo:
      'Exercício comprovado de Cargos de Direção (CD-01 a CD-04) e Funções Gratificadas (FG-01 a FG-05) no IFS ou órgãos públicos federais, incluindo substituições eventuais.',
    sugestoes: [
      {
        id: 'sug-v-1',
        itemReferencia: 'Anexo V, Item 3 (FG-01 e FG-02)',
        pontosSugeridos: 4.5,
        unidadeSugerida: 'Por ano ou fração > 6 meses',
        pontosMaximos: 30.0,
        tituloAtividade: 'Exercício de Função Gratificada FG-01 ou FG-02 (Coordenador Geral / Gerente)',
        descricaoExemplo:
          'Titularidade de função gratificada de coordenação geral de diretoria, chefia de departamento ou coordenadorias estratégicas na Reitoria ou Campi.',
        documentosAceitos: [
          'Portaria de designação e portaria de dispensa publicadas no Boletim de Serviço ou DOU',
          'Certidão de tempo de exercício de função gratificada emitida pela DGP/PROGEP',
          'Extrato funcional do SIAPE / SouGov com histórico de cargos em comissão',
        ],
        requisitosEssenciais: [
          'Cômputo proporcional por ano completo ou fração superior a 6 meses',
          'Substitutos eventuais comprovados pontuam proporcionalmente (1,5 pt por ano)',
        ],
        dicaComissao:
          'Solicite à DGP a "Certidão Narrativa de Histórico de Cargos e Funções Comissionadas" para comprovação unificada.',
      },
      {
        id: 'sug-v-2',
        itemReferencia: 'Anexo V, Item 4 (FG-03, FG-04 e FG-05)',
        pontosSugeridos: 3.0,
        unidadeSugerida: 'Por ano ou fração > 6 meses',
        pontosMaximos: 20.0,
        tituloAtividade: 'Exercício de Função Gratificada FG-03, FG-04 ou FG-05',
        descricaoExemplo:
          'Chefias de setores operacionais, núcleos setoriais, coordenações de apoio técnico e assessoramentos intermediários em campus.',
        documentosAceitos: [
          'Portaria de designação publicada no Boletim de Serviço',
          'Certidão da DGP com datas de início e término de exercício',
          'Extrato do SIAPE com histórico de código de função',
        ],
        requisitosEssenciais: ['Datas precisas de início e encerramento para aferição do tempo total em meses'],
        dicaComissao: 'Períodos em diferentes funções gratificadas somam o tempo total exercido.',
      },
      {
        id: 'sug-v-3',
        itemReferencia: 'Anexo V, Item 1 e 2 (Cargos de Direção CD-02, CD-03 e CD-04)',
        pontosSugeridos: 7.5,
        unidadeSugerida: 'Por ano ou fração > 6 meses',
        pontosMaximos: 40.0,
        tituloAtividade: 'Exercício de Cargo de Direção (CD-02, CD-03 ou CD-04)',
        descricaoExemplo:
          'Diretores Sistêmicos, Diretores de Administração, Diretores de Ensino, Pró-Reitores Adjuntos ou Diretores Gerais de Campus.',
        documentosAceitos: [
          'Portaria de nomeação no Diário Oficial da União (DOU)',
          'Termo de Posse lavrado em livro próprio da Reitoria',
          'Certidão de tempo de efetivo exercício em CD emitida pela DGP',
        ],
        requisitosEssenciais: ['Publicação em DOU e ateste de investidura pelo Gabinete do Reitor'],
        dicaComissao: 'CD-02 confere 9,00 pts/ano e CD-03/CD-04 confere 7,50 pts/ano.',
      },
    ],
  },

  'VI - Produção Científica e Tecnológica': {
    eixoKey: 'VI - Produção Científica e Tecnológica',
    eixoNome: 'Requisito VI: Produção Científica, Tecnológica e Propriedade Intelectual',
    anexo: 'Anexo VI - Resolução CS/IFS nº 394/2026',
    fundamentoLegal: 'Decreto nº 13.048/2026 e Art. 7º da Resolução 394/2026',
    pontuacaoMaximaEixo: '50,00 pontos',
    resumoEixo:
      'Depósito ou concessão de patentes e programas de computador no INPI, livros e artigos com conselho editorial, instrutoria interna vinculada ao PDP, liderança de grupos de pesquisa e cursos de formação superior não usados no IQ.',
    sugestoes: [
      {
        id: 'sug-vi-1',
        itemReferencia: 'Anexo VI, Item 2 (Depósito no INPI / Registro de Software)',
        pontosSugeridos: 25.0,
        unidadeSugerida: 'Por registro no INPI',
        pontosMaximos: 50.0,
        tituloAtividade: 'Registro de Programa de Computador / Depósito de Patente no INPI',
        descricaoExemplo:
          'Certificado de registro de software ou depósito de patente de invenção / modelo de utilidade expedido pelo Instituto Nacional da Propriedade Industrial (INPI) vinculado ao IFS.',
        documentosAceitos: [
          'Certificado Oficial de Registro de Programa de Computador do INPI (ex: BR51...)',
          'Guia de Recolhimento e Comprovante de Depósito de Pedido de Patente com número de processo INPI',
          'Atestado do Núcleo de Inovação Tecnológica (NIT/PROPPI) confirmando a titularidade institucional',
        ],
        requisitosEssenciais: [
          'Nome do servidor como autor ou cotitular no certificado emitido pelo INPI',
          'Vínculo institucional com o Instituto Federal de Sergipe',
        ],
        dicaComissao:
          'Requisito obrigatório para quem pleiteia RSC-VI (equivalência a Mestrado) conforme art. 7º, § 3º da Resolução 394/2026.',
      },
      {
        id: 'sug-vi-2',
        itemReferencia: 'Anexo VI, Item 15 (Instrutoria Interna / Capacitação PDP)',
        pontosSugeridos: 4.5,
        unidadeSugerida: 'Por curso/turma',
        pontosMaximos: 18.0,
        tituloAtividade: 'Instrutoria, Tutoria ou Palestrante em Cursos Previstos no PDP do IFS',
        descricaoExemplo:
          'Atuação como instrutor interno em capacitações de servidores promovidas pela DGP/IFS no âmbito do Plano de Desenvolvimento de Pessoas (PDP).',
        documentosAceitos: [
          'Certificado de Instrutoria emitido pela Pró-Reitoria de Desenvolvimento Institucional / DGP',
          'Portaria de designação de instrutor interno ou termo de compromisso de execução pedagógica',
          'Relatório de execução do curso com lista de concluintes e carga horária',
        ],
        requisitosEssenciais: ['Comprovação de previsão no PDP anual e emissão oficial pelo setor de capacitação'],
        dicaComissao: 'Diferencial altamente aceito para quem ministra cursos operacionais no IFS.',
      },
      {
        id: 'sug-vi-3',
        itemReferencia: 'Anexo VI, Item 9 e 10 (Livros, Artigos e Capítulos Especializados)',
        pontosSugeridos: 7.5,
        unidadeSugerida: 'Por publicação / artigo',
        pontosMaximos: 30.0,
        tituloAtividade: 'Publicação de Artigo em Periódico Especializado ou Capítulo de Livro com ISBN',
        descricaoExemplo:
          'Artigo científico publicado em periódico indexado com Qualis/ISSN ou capítulo de livro técnico-científico com conselho editorial e ISBN registrado na CBL.',
        documentosAceitos: [
          'Cópia da folha de rosto, sumário e ficha catalográfica com conselho editorial e ISBN/ISSN',
          'Link do DOI ou comprovante de indexação em base científica reconhecida',
          'Declaração da editora confirmando a revisão cega por pares',
        ],
        requisitosEssenciais: ['Ficha catalográfica completa e menção expressa de autoria do requerente'],
        dicaComissao: 'Livros com Conselho Editorial da EdIFS ou editoras acadêmicas recebem 20,00 pts (Item 9).',
      },
      {
        id: 'sug-vi-4',
        itemReferencia: 'Anexo VI, Item 4 (Educação Formal Não Utilizada em IQ)',
        pontosSugeridos: 15.0,
        unidadeSugerida: 'Por curso concluído',
        pontosMaximos: 30.0,
        tituloAtividade: 'Curso Superior de Graduação ou Pós-Graduação Não Utilizado em IQ',
        descricaoExemplo:
          'Diploma de curso de graduação ou certificado de especialização reconhecido pelo MEC que não tenha sido aproveitado para percepção do Incentivo à Qualificação formal.',
        documentosAceitos: [
          'Diploma registrado ou Certificado de Conclusão com histórico escolar completo',
          'Declaração da DGP atestando que o respectivo título não foi utilizado para fins de IQ ordinário',
        ],
        requisitosEssenciais: [
          'Declaração expressa da comissão de pessoal/DGP garantindo a não ocorrência de bis in idem',
        ],
        dicaComissao:
          'Permite pontuar títulos acadêmicos excedentes que não puderam ser enquadrados no IQ tradicional.',
      },
    ],
  },
};
