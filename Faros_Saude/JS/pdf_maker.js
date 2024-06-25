document.addEventListener('DOMContentLoaded', (event) => {
    // Lista de questionários
    let questionarios = ["qsc", "est", "ese", "ess", "esp", "qsm", "iab", "isi", "qmv", "eia", "whoqol"];
    // Lista de legendas
    let legendas = ["QSC", "EST", "ESE", "ESS", "ESP", "QSM", "IAB", "ISI", "QMV", "EIA", "WHOQOL"];

    // Lista dos IDs das divs de cada questionário
    let idsDivs = ["div-QSC", "div-WHOQOL", "div-EST", "div-ESE", "div-ESS", "div-ESP", "div-QSM", "div-IAB", "div-ISI", "div-QMV", "div-EIA"];

    // Lista de IDs das funções que insere conteúdo em cada div individualmente
    let nomesFuncoes = ["div_QSC", "div_WHOQOL", "div_EST", "div_ESE", "div_ESS", "div_ESP", "div_QSM", "div_IAB", "div_ISI", "div_QMV", "div_EIA"];

    // Função para coletar todas as respostas e textos das perguntas
    function coletaRespostas() {
        let todosValores = {};
        let todosTextos = {};

        // Obter todos os iframes
        let iframes = document.querySelectorAll('iframe');

        // Iterar sobre cada iframe
        iframes.forEach(iframe => {
            // Certifique-se de que o iframe está completamente carregado antes de coletar os dados
            if (iframe.contentWindow.document.readyState === 'complete') {
                // Coletar inputs dentro do iframe
                let inputs = iframe.contentWindow.document.querySelectorAll('input');
                // Para cada input
                inputs.forEach(input => {
                    // Extrai o nome da pergunta
                    let match = input.id.match(/(.+)_\w+$/);
                    if (match) {
                        let nomePergunta = match[1];
                        let nomeVariavel;

                        // Dependendo do tipo de input, armazena o valor ou a seleção no objeto de valores
                        switch (input.type) {
                            case 'radio':
                            case 'checkbox':
                                if (input.checked) {
                                    let nomeVariavel = nomePergunta.replace(/_/g, '') + (input.id.match(/_opcao\d+(_[a-z])?$/)[1] ? input.id.match(/_opcao\d+(_[a-z])?$/)[1].slice(1) : '');
                                    nomeVariavel = nomeVariavel.replace(/opcao\d+/, '');  // Remove a parte "opcao1"
                                    if (!todosValores[nomeVariavel]) {
                                        todosValores[nomeVariavel] = [];
                                    }
                                    todosValores[nomeVariavel].push(input.value);
                                }
                                break;
                            case 'number':
                                let nomeVariavelNum = nomePergunta.replace(/_/g, '') + 'num';
                                todosValores[nomeVariavelNum] = input.value;
                                break;
                            case 'time':
                                let nomeVariavelTime = nomePergunta.replace(/_/g, '') + 'time';
                                todosValores[nomeVariavelTime] = input.value;
                                break;
                            case 'date':
                                let nomeVariavelDate = nomePergunta.replace(/_/g, '') + 'date';
                                todosValores[nomeVariavelDate] = input.value;
                                break;
                            case 'text':
                                let nomeVariavelText = nomePergunta.replace(/_/g, '') + 'text';
                                todosValores[nomeVariavelText] = input.value;
                                break;
                        }
                    }
                });

                questionarios.forEach(prefixoQuestionario => {
                    let textareas = iframe.contentWindow.document.querySelectorAll(`textarea[id^="${prefixoQuestionario}_pergunta"]`);
                    textareas.forEach(textarea => {
                        // Extrai o número da pergunta e cria o nome da variável
                        // Remove 'opcao' seguido por um ou mais dígitos
                        let nomeVariavel = textarea.id.replace(/opcao\d+/g, '');
                
                        // Remove todos os sublinhados da ID
                        nomeVariavel = nomeVariavel.replace(/_/g, '');
                
                        // Armazena o valor da textarea no objeto de valores
                        todosValores[nomeVariavel] = textarea.value;
                    });
                });                              
            
                // Coletar legendas dentro do iframe
                let legendas = iframe.contentWindow.document.querySelectorAll('legend');
                // Para cada legenda
                legendas.forEach(legenda => {
                    // Coleta o texto da tag legend
                    let texto = legenda.innerText;
                    let nomeVariavel = legenda.id.replace(/_/g, '');
                    todosTextos[nomeVariavel] = texto;

                    // Para cada letra de "a" a "z"
                    for (let j = 0; j < 26; j++) {
                        // Constrói o id da pergunta para o novo formato
                        let idPerguntaNovo = `${nomeVariavel}_pergunta${String.fromCharCode(97 + j)}`;

                        // Seleciona a tag legend pelo id dentro do iframe
                        let legendNovo = iframe.contentWindow.document.getElementById(idPerguntaNovo);

                        // Se a tag legend existir
                        if (legendNovo) {
                            // Coleta o texto da tag legend
                            let textoNovo = legendNovo.innerText;
                            todosTextos[idPerguntaNovo] = textoNovo;
                        }
                    }
                });
            }
        });

        // Converte os arrays de checkbox em strings
        for (let nomeVariavel in todosValores) {
            if (Array.isArray(todosValores[nomeVariavel])) {
                todosValores[nomeVariavel] = todosValores[nomeVariavel].join(', ');
            }
        }

        // Adiciona a funcionalidade para trocar valores vazios por 'Não respondido.'
        for (let chave in todosValores) {
            if (todosValores[chave] === '') {
            todosValores[chave] = 'Não respondido.';
            }
        }

        console.log(todosValores);

        // Retorna o objeto com todos os valores coletados e todos os textos das perguntas
        return {valores: todosValores, textos: todosTextos};
    }

    function acionarFuncoesQuestionarios(todosValores, todosTextos) {
        let iframes = document.querySelectorAll('iframe');
        
        iframes.forEach(iframe => {
            // Certifique-se de que o documento do iframe está completamente carregado
            if (iframe.contentWindow.document.readyState === 'complete') {
                // Chama cada função individualmente, passando os dados coletados
                nomesFuncoes.forEach(nomeFuncao => {
                    try {
                        let funcao = iframe.contentWindow[nomeFuncao];
                        if (typeof funcao === 'function') {
                            // Passa os dados coletados para a função
                            funcao(todosValores, todosTextos);
                        }
                    } catch (erro) {
                        console.error(`Erro ao chamar a função ${nomeFuncao} no iframe:`, erro);
                    }
                });
            } else {
                iframe.onload = function() {
                    // Chama cada função individualmente, passando os dados coletados
                    nomesFuncoes.forEach(nomeFuncao => {
                        try {
                            let funcao = iframe.contentWindow[nomeFuncao];
                            if (typeof funcao === 'function') {
                                // Passa os dados coletados para a função
                                funcao(todosValores, todosTextos);
                            }
                        } catch (erro) {
                            console.error(`Erro ao chamar a função ${nomeFuncao} no iframe:`, erro);
                        }
                    });
                };
            }
        });
    }
   
    function verificarQuestoesEmBranco() {
        let divMaster = document.getElementById('div-MASTER');
        let questoesEmBranco = false;
        let divULTRA = document.getElementById('div-ULTRA'); // assuming this is the correct ID
    
        let apagar1 = function() { divULTRA.innerHTML = ''; };
        let apagar2 = function() { divMaster.innerHTML = ''; };
          
        // Verifica se existem questões não respondidas na div-MASTER
        let respostas = divMaster.querySelectorAll('.Resposta,.Resposta_sub');
        respostas.forEach(resposta => {
            if (resposta.textContent === 'Não respondido.') {
                questoesEmBranco = true;
                }
            });
            
            if (questoesEmBranco) {
                let confirmacao = confirm('Ficaram questões em branco. Você tem certeza que deseja continuar?');
                if (!confirmacao) {
                    ocultarDiv();
                    apagar2();
                    apagar1();
                    return false; // Retorna false se o usuário cancelar
                    }
            }
            
            return true; // Retorna true se o usuário não cancelar
      }

    function coletarEConcatenarDivs() {

        // Seleciona a div_MASTER
        let divMaster = document.getElementById('div-MASTER');

        // Para cada iframe
        let iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            // Verifica se o iframe já foi carregado
            if (iframe.contentWindow.document.readyState === 'complete') {
                // Para cada ID na lista
                idsDivs.forEach(id => {
                    
                    // Seleciona a div do questionário dentro do iframe
                    let divQuestionario = iframe.contentWindow.document.getElementById(id);

                    // Se a div existir
                    if (divQuestionario) {
                        // Adiciona a funcionalidade para trocar valores undefined por 'Não respondido.'
                        let grupos = divQuestionario.querySelectorAll('.grupo-pergunta-resposta');
                        grupos.forEach(grupo => {
                          let respostas = grupo.querySelectorAll('.Resposta, .Resposta_sub');
                          respostas.forEach(resposta => {
                            if (resposta.textContent === 'undefined') {
                              resposta.textContent = 'Não respondido.';
                              resposta.style.color = 'red';
                              resposta.style.fontWeight = 'bold';
                            } else if (resposta.textContent === 'Não respondido.') {
                                resposta.style.color = 'red';
                                resposta.style.fontWeight = 'bold';
                            }
                          });
                        });

                        // Adiciona o conteúdo da div do questionário à div_MASTER
                        divMaster.innerHTML += divQuestionario.innerHTML;
                        console.log(`Div ${id} adicionada à div-MASTER.`);

                    }
                });
            } else {
                // Se o iframe ainda não foi carregado, define um evento onload para concatenar as divs após o carregamento
                iframe.onload = function() {
                    idsDivs.forEach(id => {
                        let divQuestionario = iframe.contentWindow.document.getElementById(id);
                        if (divQuestionario) {
                            // Adiciona a funcionalidade para trocar valores undefined por 'Não respondido.'
                            let grupos = divQuestionario.querySelectorAll('.grupo-pergunta-resposta');
                            grupos.forEach(grupo => {
                              let respostas = grupo.querySelectorAll('.Resposta, .Resposta_sub');
                              respostas.forEach(resposta => {
                                if (resposta.textContent === 'undefined') {
                                  resposta.textContent = 'Não respondido.';
                                  resposta.style.color = 'red';
                                  resposta.style.fontWeight = 'bold';
                                } else if (resposta.textContent === 'Não respondido.') {
                                    resposta.style.color = 'red';
                                    resposta.style.fontWeight = 'bold';
                                }
                              });
                            });

                            divMaster.innerHTML += divQuestionario.innerHTML;
                            console.log(`Div ${id} adicionada à div-MASTER.`);
                        }
                    });
                };
            }
        });

        console.log('Todas as divs foram adicionadas à div-MASTER.');
    }

    function ocultarDiv() {
        // Seleciona todos os iframes
        let iframes = document.querySelectorAll('iframe');

        // Itera sobre os iframes
        iframes.forEach(iframe => {
            // Seleciona todas as divs com classe Grupo_div dentro da div-ULTRA
            let grupoDivs = iframe.contentWindow.document.querySelectorAll('.Grupo_div');

            // Itera sobre as divs encontradas
            grupoDivs.forEach(div => {
            // Oculta a div
            div.style.display = 'none';
            });
        /*// Seleciona todos os iframes
        let iframes = document.querySelectorAll('iframe');
      
        // Itera sobre os iframes
        iframes.forEach(iframe => {
          // Itera sobre os IDs das divs que devem ser ocultadas
          idsDivs.forEach(id => {
            // Seleciona a div individual dentro do iframe
            let divIndividual = iframe.contentWindow.document.getElementById(id);
      
            // Se a div existir
            if (divIndividual) {
              // Aplica um estilo temporário para ocultar a div
              divIndividual.style.visibility = 'hidden';
            }
          });*/
        });
    }

    // Botão universal
    function exibirTudo(event) {
        event.preventDefault(); // Impede o comportamento padrão do botão

        // Coleta todas as respostas e textos das perguntas
        let resultados = coletaRespostas();
        console.log(resultados);

        // Chama a função para acionar as funções dos questionários
        acionarFuncoesQuestionarios(resultados.valores, resultados.textos);

        document.querySelectorAll('iframe').forEach(iframe => {
            idsDivs.forEach(id => {
                let divQuestionario = iframe.contentWindow.document.getElementById(id);
                if (divQuestionario) {
                    console.log(`Conteúdo da div ${id}:`, divQuestionario.innerHTML);
                } else {
                    console.log(`Div ${id} está vazia ou não existe.`);
                }
            });
        });

        // Coleta e concatena todas as divs
        let final = coletarEConcatenarDivs(); // A função coletarEConcatenarDivs deve retornar algo que será armazenado em 'final'

        if (!verificarQuestoesEmBranco()) {
            return; // Para a execução do código se o usuário cancelar
        }

        // variavel para ocultar div individual para o usuário
        let ocultar = ocultarDiv();

        // Registra nome, data, div_MASTER à div_ULTRA e imprime o pdf
        documento(final); // A função 'documento' é chamada com 'final' como argumento

    }

    // Adiciona um ouvinte de evento ao botão
    document.getElementById('collectIframe').addEventListener('click', exibirTudo);

    // Ouvinte para receber a resposta do iframe
    window.addEventListener('message', (event) => {
        if (event.data.type === 'RESPOSTAS') {
            console.log(event.data.respostas);
        }
    }, false);
});
