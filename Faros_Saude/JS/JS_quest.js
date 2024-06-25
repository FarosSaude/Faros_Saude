function limparSelecoes(nomeQuestao) {
    // Get all elements with the specified name
    var elements = document.getElementsByName(nomeQuestao);

    // Loop through each element
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        // Clear the value of each element
        element.checked = false;
    }
}


// Limpa somente as perguntas do LocalStorage:
function limparRespostas() {
        // alert('Perguntas apagadas do localStorage.');
        location.reload(); // Recarrega a página
  
}


/*
// Limpa somente a caixa de seleção de cada pergunta (não remove do LocalStorage)
function limparSelecoes(nomePergunta) {
    var radios = document.getElementsByName(nomePergunta);
    for (var i = 0; i < radios.length; i++) {
        radios[i].checked = false;
    }
}
*/
/*
// Armazena os dados no local storage:
function salvarOpcoes() {
    for (let i = 1; i <= 10; i++) {
        const opcaoSelecionada = document.querySelector('input[name="quest1_pergunta' + i + '"]:checked');
        if (opcaoSelecionada) {
            localStorage.setItem('quest1_pergunta' + i, opcaoSelecionada.value);
        }
    }
    alert('Respostas salvas no localStorage.');
} 

// Lista de abreviações
const abreviacoes = ['qsc', 'est', 'ese', 'ess', 'esp', 'qsm', 'iab', 'isi', 'qmv', 'eia', 'whoqol'];

// Armazena os dados no local storage:
function salvarOpcoes() {
    abreviacoes.forEach(abreviacao => {
        let i = 1;
        while (true) {
            const opcoes = document.querySelectorAll('input[name="' + abreviacao + '_pergunta' + i + '"], textarea[name="' + abreviacao + '_pergunta' + i + '"]');
            if (opcoes.length === 0) {
                break;
            }
            opcoes.forEach(opcao => {
                if ((opcao.type === 'radio' || opcao.type === 'checkbox') && opcao.checked) {
                    localStorage.setItem(abreviacao + '_pergunta' + i, opcao.value);
                } else if (opcao.type === 'textarea' && opcao.value) {
                    localStorage.setItem(abreviacao + '_pergunta' + i, opcao.value);
                }
            });
            i++;
        }
    });
    alert('Respostas salvas no localStorage.');
}
*/
// // Lista de abreviações
// const abreviacoes = ['qsc', 'est', 'ese', 'ess', 'esp', 'qsm', 'iab', 'isi', 'qmv', 'eia', 'whoqol'];

// // Armazena os dados no local storage:
// function salvarOpcoes() {
//     abreviacoes.forEach(abreviacao => {
//         let i = 1;
//         while (true) {
//             const opcoes = document.querySelectorAll('input[name="' + abreviacao + '_pergunta' + i + '"], textarea[name="' + abreviacao + '_pergunta' + i + '"]');
//             if (opcoes.length === 0) {
//                 break;
//             }
//             opcoes.forEach(opcao => {
//                 if (opcao.checked || opcao.value) {
//                     localStorage.setItem(abreviacao + '_pergunta' + i, opcao.value);
//                 }
//             });
//             i++;
//         }
//     });
//     alert('Respostas salvas no localStorage.');
// }

/*
// Limpa somente as perguntas do LocalStorage:
function limparRespostas() {
    Object.keys(localStorage).forEach(function(key){
        if (/^(qsc|est|ese|ess|esp|qsm|iab|isi|qmv|eia|whoqol)_pergunta\d+$/.test(key)) {
            localStorage.removeItem(key);
        }
    });
    alert('Perguntas apagadas do localStorage.');
    location.reload(); // Recarrega a página
}
*/

// // Limpa somente todas as questões do LocalStorage:
// function limparRespostas() {
//     abreviacoes.forEach(abreviacao => {
//         let i = 1;
//         while (true) {
//             const opcoes = document.querySelectorAll('input[name="' + abreviacao + '_pergunta' + i + '"], textarea[name="' + abreviacao + '_pergunta' + i + '"]');
//             if (opcoes.length === 0) {
//                 break;
//             }
//             localStorage.removeItem(abreviacao + '_pergunta' + i);
//             i++;
//         }
//     });
//     alert('Respostas apagadas.');
//     location.reload(); // Recarrega a página
// }
/*
// Limpa somente todas as questões do LocalStorage:
function limparRespostas() {
    for (let i = 1; i <= 10; i++) {
        localStorage.removeItem('quest1_pergunta' + i);
    }
    alert('Respostas apagadas.');
    location.reload(); // Recarrega a página
}

// Apaga todo o localstorage:
function limparLocalStorage() {
    // Limpar todas as chaves do localStorage
    localStorage.clear();
    alert('LocalStorage reiniciado.');
    location.reload(); // Recarrega a página
}
*/