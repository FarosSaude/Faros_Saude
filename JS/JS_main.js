window.onload = function() {
    const htmlContainer = document.getElementById('htmlContainer');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const selectedQuestionarios = urlParams.getAll('questionario');

    if (selectedQuestionarios.length === 0) {
        alert('Nenhum questionário selecionado.');
        window.location.href = 'selecionar_questionarios.html';
    }

    selectedQuestionarios.forEach(questionario => {
        const iframe = document.createElement('iframe');
        iframe.src = questionario;
        htmlContainer.appendChild(iframe);
    });

    // Ouvinte para receber a solicitação do documento principal
    window.addEventListener('message', (event) => {
        if (event.data.type === 'REQUEST_RESPOSTAS') {
            let respostas = coletaRespostas();
            // Envia as respostas de volta para o documento principal
            event.source.postMessage({ type: 'RESPOSTAS', respostas: respostas }, '*');
        }
    }, false);

    window.addEventListener('beforeunload', function(event) {
        // Pergunta ao usuário se ele realmente quer sair
        let confirmacao = confirm('Você tem certeza que deseja sair? Se fizer isso irá perder os dados da página atual.');
    
        if (confirmacao) {
            // Se o usuário confirmou, limpa os dados
            dados.perguntas = null;
        } else {
            // Se o usuário cancelou, cancela o evento
            event.preventDefault();
        }
    });

    // Ativa o iFrameResizer
    iFrameResize({ log: true }, '#htmlContainer iframe');
}
