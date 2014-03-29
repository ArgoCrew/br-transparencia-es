var request = require('request')
  , https = require("https")
  , cheerio = require('cheerio')
  , async = require('async')
  , format = require('util').format;

var requestOptions = { strictSSL: false };

var obras = [4040]
  , concurrency = 1;

async.eachLimit(obras, concurrency, function (idObra, next) {
    var urlDetalheObra = format('https://geoobras.tce.es.gov.br/cidadao/Obras/ObrasPaginaInteiraDetalhes.aspx?IDOBRA=%s&tipo=I', idObra);
    requestOptions.url = urlDetalheObra;

    request(requestOptions, function (err, response, body) {
        if (err) throw err;
        var $ = cheerio.load(body);
        
        var obra = {
          orgao_publico: $('table.listagem:nth-child(2) tr:nth-child(1) td:nth-child(2)').text().trim(),
          bem_publico: $('table.listagem:nth-child(2) tr:nth-child(2) td:nth-child(2)').text().trim(),
          descricao: $('table.listagem:nth-child(2) tr:nth-child(3) td:nth-child(2)').text().trim(),
          quantide_unidade_medida: $('table.listagem:nth-child(2) tr:nth-child(4) td:nth-child(2)').text().trim(),
          setor_beneficiado: $('table.listagem:nth-child(2) tr:nth-child(5) td:nth-child(2)').text().trim(),
          tipo: $('table.listagem:nth-child(2) tr:nth-child(6) td:nth-child(2)').text().trim(),
          tipo_servico: $('table.listagem:nth-child(2) tr:nth-child(7) td:nth-child(2)').text().trim(),
          endereco: {
            logradouro: $('table.listagem:nth-child(2) tr:nth-child(8) td:nth-child(2)').text().trim(),
            bairro: $('table.listagem:nth-child(2) tr:nth-child(9) td:nth-child(2)').text().trim(),
            municipio: $('table.listagem:nth-child(2) tr:nth-child(10) td:nth-child(2)').text().trim(),
            cep: $('table.listagem:nth-child(2) tr:nth-child(11) td:nth-child(2)').text().trim()
          },

          engenheiros: {
            fiscalizacao: $('table.listagem:nth-child(4) tr:nth-child(1) td:nth-child(2)').text().trim(),
            execucao: $('table.listagem:nth-child(4) tr:nth-child(2) td:nth-child(2)').text().trim()
          },

          contrato: {
            //TODO: Separar numero, ano e numero do cantrato
            numero: $('#ctl00_ContentPlaceHolderConteudo_contratoLabel').text().trim(),
            ano: $('#ctl00_ContentPlaceHolderConteudo_contratoLabel').text().trim(),
            numero_obra: $('#ctl00_ContentPlaceHolderConteudo_contratoLabel').text().trim(),
            data_assinatura: $('#ctl00_ContentPlaceHolderConteudo_dataAssinaturaLabel').text().trim(), 
            regime_execucao: $('#ctl00_ContentPlaceHolderConteudo_regimeExecucaoLabel').text().trim(),
              //TODO: Separar modalidade, numero e ano da licitacao
              modalidade_licitacao: $('#ctl00_ContentPlaceHolderConteudo_modalidadeLicitacaoLabel').text().trim(),
              numero_licitacao: $('#ctl00_ContentPlaceHolderConteudo_editalNumeroLabel').text().trim(),
              ano_licitacao: $('#ctl00_ContentPlaceHolderConteudo_editalNumeroLabel').text().trim(),
              empresa: {
                razao_social: $('#ctl00_ContentPlaceHolderConteudo_empresaConstrutoraLabel').text().trim(),
                cnpj: $('#ctl00_ContentPlaceHolderConteudo_cnpjLabel').text().trim()
              }
          },
          execucao: {
            forma: $('#contratosTable tr:nth-child(2) td:nth-child(2)').text().trim(),
            indireta: {

            },
            situacao: $('#dadosObrasExecucaoIndiretaTable tr:nth-child(3) td:nth-child(2)').text().trim(),
            //TODO: Separar situação da data
            data: $('#dadosObrasExecucaoIndiretaTable tr:nth-child(3) td:nth-child(2)').text().trim(),
            //TODO: Separar data da situação
            prazo_inicial: $('#dadosObrasExecucaoIndiretaTable tr:nth-child(4) td:nth-child(2)').text().trim(),
            prazo_aditado: $('#dadosObrasExecucaoIndiretaTable tr:nth-child(4) td:nth-child(4)').text().trim(),
            prazo_total: $('#dadosObrasExecucaoIndiretaTable tr:nth-child(4) td:nth-child(6)').text().trim(),
            valor_inicial: $('#dadosObrasExecucaoIndiretaTable tr:nth-child(5) td:nth-child(2)').text().trim(),
            valor_aditado: $('#dadosObrasExecucaoIndiretaTable tr:nth-child(5) td:nth-child(4)').text().trim(),
            valor_total_atual: $('#dadosObrasExecucaoIndiretaTable tr:nth-child(5) td:nth-child(6)').text().trim(),
            valor_total_medicao: $('#dadosObrasExecucaoIndiretaTable tr:nth-child(6) td:nth-child(2)').text().trim(),
            valor_total_material: $('#dadosObrasExecucaoIndiretaTable tr:nth-child(6) td:nth-child(4)').text().trim(),
            valor_total_maquina_equipamento: $('#dadosObrasExecucaoIndiretaTable tr:nth-child(6) td:nth-child(6)').text().trim()
          }
        };

        console.log(obra);
        
        next();
    });

    var urlDetalheObra = format('https://geoobras.tce.es.gov.br/cidadao/Obras/ObrasPaginaInteiraDetalhes.aspx?IDOBRA=%s&tipo=I', idObra);
    requestOptions.url = urlDetalheObra;
});