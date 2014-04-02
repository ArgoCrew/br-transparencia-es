var request = require('request')
  , https = require("https")
  , cheerio = require('cheerio')
  , async = require('async')
  , format = require('util').format;

request = request.defaults({ strictSSL: false });

var idObras = [4380, 4040, 4024, 4021, 4008, 3982],
	concurrency = 3;

var obras = [];

//async.eachLimit(idObras, concurrency, scrapingObra);

for (var i = 0; i < idObras.length; i++) {
	scrapingObra(idObras[i]);
};

function scrapingObra(idObra) {
    var obra = {};
    obra.id_geo_obra = idObra;

    scrapingObraDetalhe(obra);
    scrapingObraLocalizacao(obra);
    scrapingObraFotos(obra);
}

function scrapingObraDetalhe(obra) {
	var url = format('https://geoobras.tce.es.gov.br/cidadao/Obras/ObrasPaginaInteiraDetalhes.aspx?IDOBRA=%s&tipo=I', obra.id_geo_obra);
    request(url, function (err, response, body) {
        if (err) throw err;
        var $ = cheerio.load(body);

		obra.orgao_publico = $('table.listagem:nth-child(2) tr:nth-child(1) td:nth-child(2)').text().trim();
	  	obra.bem_publico = $('table.listagem:nth-child(2) tr:nth-child(2) td:nth-child(2)').text().trim();
	  	obra.descricao = $('table.listagem:nth-child(2) tr:nth-child(3) td:nth-child(2)').text().trim();
	  	obra.quantide_unidade_medida = $('table.listagem:nth-child(2) tr:nth-child(4) td:nth-child(2)').text().trim();
	  	obra.setor_beneficiado = $('table.listagem:nth-child(2) tr:nth-child(5) td:nth-child(2)').text().trim();
	  	obra.tipo = $('table.listagem:nth-child(2) tr:nth-child(6) td:nth-child(2)').text().trim();
	  	obra.tipo_servico = $('table.listagem:nth-child(2) tr:nth-child(7) td:nth-child(2)').text().trim();
	  	
	  	if (!obra.endereco) {
	  		obra.endereco = {};
	  	}
		obra.endereco.logradouro = $('table.listagem:nth-child(2) tr:nth-child(8) td:nth-child(2)').text().trim();
		obra.endereco.bairro = $('table.listagem:nth-child(2) tr:nth-child(9) td:nth-child(2)').text().trim();
		obra.endereco.municipio = $('table.listagem:nth-child(2) tr:nth-child(10) td:nth-child(2)').text().trim();
		obra.endereco.cep =  $('table.listagem:nth-child(2) tr:nth-child(11) td:nth-child(2)').text().trim();

	  	obra.engenheiros = {};
		obra.engenheiros.fiscalizacao = $('table.listagem:nth-child(4) tr:nth-child(1) td:nth-child(2)').text().trim();
		obra.engenheiros.execucao = $('table.listagem:nth-child(4) tr:nth-child(2) td:nth-child(2)').text().trim();

	  	obra.contrato = {};
		//TODO: Separar numero, ano e numero do cantrato
		obra.contrato.numero = $('#ctl00_ContentPlaceHolderConteudo_contratoLabel').text().trim();
		obra.contrato.ano = $('#ctl00_ContentPlaceHolderConteudo_contratoLabel').text().trim();
		obra.contrato.numero_obra = $('#ctl00_ContentPlaceHolderConteudo_contratoLabel').text().trim();
		obra.contrato.data_assinatura = $('#ctl00_ContentPlaceHolderConteudo_dataAssinaturaLabel').text().trim();
		obra.contrato.regime_execucao = $('#ctl00_ContentPlaceHolderConteudo_regimeExecucaoLabel').text().trim();
	  	//TODO: Separar modalidade, numero e ano da licitacao
	  	obra.contrato.modalidade_licitacao = $('#ctl00_ContentPlaceHolderConteudo_modalidadeLicitacaoLabel').text().trim();
	  	obra.contrato.numero_licitacao = $('#ctl00_ContentPlaceHolderConteudo_editalNumeroLabel').text().trim();
	  	obra.contrato.ano_licitacao = $('#ctl00_ContentPlaceHolderConteudo_editalNumeroLabel').text().trim();
	  	obra.contrato.empresa = {};
		obra.contrato.empresa.razao_social = $('#ctl00_ContentPlaceHolderConteudo_empresaConstrutoraLabel').text().trim();
		obra.contrato.empresa.cnpj = $('#ctl00_ContentPlaceHolderConteudo_cnpjLabel').text().trim();
		  	
	  	obra.execucao = {};
		obra.execucao.forma = $('#contratosTable tr:nth-child(2) td:nth-child(2)').text().trim(),
		//obra.execucao.indireta = {};
		obra.execucao.situacao = $('#dadosObrasExecucaoIndiretaTable tr:nth-child(3) td:nth-child(2)').text().trim();
		//TODO: Separar situação da data
		obra.execucao.data = $('#dadosObrasExecucaoIndiretaTable tr:nth-child(3) td:nth-child(2)').text().trim();
		//TODO: Separar data da situação
		obra.execucao.prazo_inicial = $('#dadosObrasExecucaoIndiretaTable tr:nth-child(4) td:nth-child(2)').text().trim();
		obra.execucao.prazo_aditado = $('#dadosObrasExecucaoIndiretaTable tr:nth-child(4) td:nth-child(4)').text().trim();
		obra.execucao.prazo_total = $('#dadosObrasExecucaoIndiretaTable tr:nth-child(4) td:nth-child(6)').text().trim();
		obra.execucao.valor_inicial = $('#dadosObrasExecucaoIndiretaTable tr:nth-child(5) td:nth-child(2)').text().trim();
		obra.execucao.valor_aditado = $('#dadosObrasExecucaoIndiretaTable tr:nth-child(5) td:nth-child(4)').text().trim();
		obra.execucao.valor_total_atual = $('#dadosObrasExecucaoIndiretaTable tr:nth-child(5) td:nth-child(6)').text().trim();
		obra.execucao.valor_total_medicao = $('#dadosObrasExecucaoIndiretaTable tr:nth-child(6) td:nth-child(2)').text().trim();
		obra.execucao.valor_total_material = $('#dadosObrasExecucaoIndiretaTable tr:nth-child(6) td:nth-child(4)').text().trim();
		obra.execucao.valor_total_maquina_equipamento = $('#dadosObrasExecucaoIndiretaTable tr:nth-child(6) td:nth-child(6)').text().trim();

		//console.log(obra);
	});
}

function scrapingObraLocalizacao(obra) {
	var url = format('https://geoobras.tce.es.gov.br/Cidadao/Mapa/MapaPaginaInteiraDetalhes.aspx?IDOBRA=%s&tipo=O', obra.id_geo_obra);
    request(url, function (err, response, body) {
    	if (err) throw err;
    	var $ = cheerio.load(body);

	  	if (!obra.endereco) {
	  		obra.endereco = {};
	  	}

	  	var latitude = new RegExp('pLat=(.+?)(&|$)').exec($('#ifrMapa').attr('src'))[1];
	  	var longitude = new RegExp('pLon=(.+?)(&|$)').exec($('#ifrMapa').attr('src'))[1];

		obra.endereco.coordenadas = {
			latitude: latitude,
			longitude: longitude
		};

		console.log(obra);
    });
}

function scrapingObraFotos(obra) {
	var url = format('https://geoobras.tce.es.gov.br/Cidadao/Fotos/GaleriaFoto.aspx?IDOBRA=%s&tipo=O', obra.id_geo_obra);
    request(url, function (err, response, body) {
    	if (err) throw err;
    	var $ = cheerio.load(body);

	  	if (!obra.endereco) {
	  		obra.endereco = {};
	  	}

	  	obra.fotos = [];

	  	$('#thumbs li').each(function () {
	  		var foto = {};
	  		foto.url = 'https://geoobras.tce.es.gov.br/Cidadao/Fotos/' + $('.download a', this).attr('href');
	  		foto.titulo = $('.image-title', this).text().trim();
	  		foto.nome_arquivo = new RegExp('arquivo=(.+?)(&|$)').exec($('a.thumb', this).attr('href'))[1];
	  		obra.fotos.push(foto);
	  	});

		//console.log(obra.fotos);
    });
}