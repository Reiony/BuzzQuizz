function renderFirstPage() {
    const main = document.querySelector("main");
    main.innerHTML = `<div class="firstpage">
        
    <div class="createquizz-box displayNone">
      <h3>Você não criou nenhum quizz ainda :(</h3>
      <button onclick="firstPageCreationQuizz()" data-identifier="create-quizz">Criar Quizz</button>
    </div> 

    <div class="seusquizzes ">
      <div class="seusquizzes-title">
        <h2 class="quizztab">Seus Quizzes</h2>
        <ion-icon name="add-circle" data-identifier="create-quizz" onclick="firstPageCreationQuizz()"></ion-icon>
      </div>
      <div class="containerseusquizzes" data-identifier="user-quizzes">
        <img src="https://http.cat/411.jpg" alt="">
      </div>
    </div>

    <div class='pageBoard'>
      <h2 class="quizztab allquizzes">Todos os Quizzes</h2>
      <ul data-identifier="general-quizzes">
      </ul>
    </div>
  </div>`

    getQuizz();
}
renderFirstPage();
/* Pushing quizzes from API - BuzzQuizz */

function getQuizz() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(renderQuizz)
    promise.catch(errortoRender)
}

function renderQuizz(elem) {
    const searchUl = document.querySelector("ul");
    /* console.log(elem)
    console.log(elem.data) */
    const QuizzList = elem.data;
    QuizzList.forEach(element => {
        searchUl.innerHTML += `<li onclick="openQuizz(${element.id})" id=${element.id} data-identifier="quizz-card">
        <img src="${element.image}"> <h2>${element.title}</h2> 
      </li>`

    });

}


function errortoRender() {
    alert("Falha ao Renderizar os Quizzes")
}

//FUNÇÃO PARA ESCONDER A LISTA DE QUIZZES E ABRIR O QUIZZ SELECIONADO ==========

function openQuizz(id) {
    const requisicao = axios.get(
        `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`
    );
    requisicao.then(renderizarQuizz);

}
let perguntas;
let arrayteste = [];
let novoarray;
let arrayniveis = [];
let objetoquizz;
function renderizarQuizz(response) {
    window.scrollTo(0, 0)
    /* console.log(response) */
    const main = document.querySelector("main")
    let header = document.querySelector('header');
    main.innerHTML = "";
    objetoquizz = response.data;

    /* console.log(objetoquizz.levels) */
    arrayniveis = [];
    for (let h = 0; h < objetoquizz.levels.length; h++) {
        arrayniveis.push(objetoquizz.levels[h])
    }
    /* console.log(arrayniveis); */



    perguntas = response.data.questions;
    /* console.log(perguntas); */
    header.innerHTML += `
      <div class="banner">
        <img src="${objetoquizz.image}">
        <div class="titulo">${objetoquizz.title}</div>
      </div>
  `;
    for (let i = 0; i < perguntas.length; i++) {
        arrayteste.push(perguntas[i].answers)
        /* console.log(arrayteste[i]) */
        novoarray = arrayteste[i].sort(() => 0.5 - Math.random());
        /* console.log(arrayteste,novoarray) */
        main.innerHTML += `<div class="caixaquizz">
        <div class="pergunta" style="background-color: ${perguntas[i].color}" data-identifier="question">
            ${perguntas[i].title}
        </div>
        <div class="opções">
        </div>
        </div>
        `
        for (let j = 0; j < novoarray.length; j++) {
            const lll = document.querySelectorAll(".opções");
            lll[i].innerHTML += `
            <div class="resposta ${novoarray[j].isCorrectAnswer}" onclick="selecionaResposta(this,${j})" data-identifier="answer"> <img src="${novoarray[j].image}" > <h3>${novoarray[j].text}</h3>
            </div>`
        }
    }
}
let acertos = 0;
let respondidos = 0;
function selecionaResposta(clicado) {
    const maisumteste = clicado.parentElement;
    const outroteste = maisumteste.parentElement;
    const todascaixas = document.querySelectorAll(".caixaquizz");
    const anotherone = maisumteste.querySelectorAll(".resposta");
    for (let i = 0; i < anotherone.length; i++) {
        anotherone[i].classList.add("branquin")
        if (anotherone[i].classList.value === "resposta true branquin") {
            anotherone[i].classList.add("verdin")
            if (clicado.classList.value === "resposta true branquin verdin") {
                acertos++
            }
        } else {
            anotherone[i].classList.add("vermelhin")
        }
        anotherone[i].removeAttribute('onclick');
    }
    clicado.classList.remove("branquin");
    respondidos++;
    setTimeout(function () {
        scrollaAi(outroteste, todascaixas)
    }, 2000);
    /* setTimeout(function () {
        scrollaAi(todascaixas)
    }, 2000); */
}
let index;
function scrollaAi(caixaclicada, listanodeCaixaQuizz) {
    for (let i=0;i<listanodeCaixaQuizz.length-1;i++){
        if (caixaclicada===listanodeCaixaQuizz[i]){
            listanodeCaixaQuizz[(i+1)].scrollIntoView();
        }
    }
    if ((caixaclicada===listanodeCaixaQuizz[listanodeCaixaQuizz.length-1]) && (respondidos<listanodeCaixaQuizz.length)){
        alert("Falta responder outros itens! Verifique novamente")
        window.scrollTo(0, 0);
    }
    if (respondidos===listanodeCaixaQuizz.length){
        const scoreofAccuracy = Math.floor((acertos / respondidos) * 100)
        console.log(scoreofAccuracy)
        verificaNivelfinal(scoreofAccuracy);
        adicionatelafinaleScrollaQuizz();
    } 
}

function verificaNivelfinal(FinalScore){
    console.log(FinalScore)
    for (let i = 0; i < (arrayniveis.length - 1); i++) {
        if ((FinalScore >= arrayniveis[i].minValue) && (FinalScore < arrayniveis[i + 1].minValue)) {
            index = i;
        } else {
            index=arrayniveis.length - 1;
        }
    } 
}
function reiniciaQuizz(){
    openQuizz(`${objetoquizz.id}`);
}

function RecarregaPagina(){
    window.location.reload();
}
function adicionatelafinaleScrollaQuizz() {
    const scoreofAccuracy = Math.floor((acertos / respondidos) * 100)
    const main = document.querySelector("main")
    main.innerHTML += 
    `<div class="telafinalquizz" data-identifier="quizz-result">
        <div class="botaocfquizz"> <h3>${scoreofAccuracy}% de acerto: ${arrayniveis[index].title}</h3>
        </div>
        <div class="sabotagemcfquizz">
            <img src="${arrayniveis[index].image}"><h4>${arrayniveis[index].text}</h4>
        </div>
    </div>`
    main.innerHTML += `<div class="opfinal">
        <button class="reiniciar" onclick="reiniciaQuizz()"><h4>Reiniciar Quizz</h4></button>
        <button class="voltartudo" onclick="RecarregaPagina();"><h5>Voltar para home</h5></button>
        </div>`
    const selecionabotaovoltar = document.querySelector(".voltartudo")
    selecionabotaovoltar.scrollIntoView();

}
/* FUNCTION THAT CREATE THE FIRST PAGE FROM QUIZZ CREATION */

function firstPageCreationQuizz() {
    const get1stpage = document.querySelector(".firstpage")
    get1stpage.classList.add(".displayNone");
    let main = document.querySelector('main');
    main.innerHTML = `
    <div class="creationPages">
      <h1 class='titleCreationQuizz'>Comece pelo começo</h1>
      <div class="inputs">
        <input type="text" placeholder="Título do seu quizz">
        <input type="url" placeholder="URL da imagem do seu quizz">
        <input type="number" placeholder="Quantidade de perguntas do quizz">
        <input type="number" placeholder="Quantidade de níveis do quizz">
      </div>
      <button onclick="startCreationQuizz()">Prosseguir pra criar perguntas</button>
    </div>
    `
}
const quizz = {}

/* FUNCTION STARTS TO CREATE THE QUIZZ OBJECT AND CALLS secondPageCreationQuizz */

const startCreationQuizz = () => {

    const inputs = document.querySelector('.inputs')
    const titleQuizz = inputs.children[0].value
    const urlQuizz = inputs.children[1].value
    const qtdAsksQuizz = inputs.children[2].value
    const qtdLevelQuizz = inputs.children[3].value

    if (titleQuizz.length > 65 || titleQuizz < 20) {
        alert('Titulo errado')
    } else if (!checkUrl(urlQuizz)) {
        alert('URL Inválida')
    } else if (qtdAsksQuizz < 3) {
        alert('A quantidade de perguntas precisa ser maior ou igual a 3!')
    } else if (qtdLevelQuizz < 2) {
        alert('A quantidade de niveis precisa ser maior ou igual a 2!')
    } else {

        quizz.title = titleQuizz
        quizz.image = urlQuizz
        quizz.questions = Number(qtdAsksQuizz)
        quizz.levels = Number(qtdLevelQuizz)
        secondPageCreationQuizz()

    }
}
const checkUrl = (string) => {
    try {
        let url = new URL(string)
        return true;
    } catch (err) {
        return false;
    }
}

/* FUNCTION THAT CREATE THE SECOND PAGE FROM QUIZZ CREATION */

const secondPageCreationQuizz = () => {
    let questions = quizz.questions
    let main = document.querySelector('main');

    main.innerHTML = `
        <div class="creationPages">
            <h1 class='titleCreationQuizz'>Crie suas perguntas</h1>
            <section></section>
            <button onclick="checkValuesSecondPage()">Prosseguir pra criar niveis</button>
        </div>  
    `
    let i = 0
    let askBoard = document.querySelector('.creationPages section')

    while (i < questions) {
        askBoard.innerHTML += `
            <div data-identifier="question-form">
                <h1>Pergunta ${i + 1}</h1>
                <ion-icon data-identifier="expand" onclick="turnOnOffEditBoard(this)" class="editIcon" name="construct-outline"></ion-icon>
                <aside class='displayNone'>
                    <article>
                        <input type="text" placeholder="Texto da pergunta">
                        <input type="text" placeholder="Cor de fundo da pergunta">
                    </article>
                    <h1>Resposta correta</h1>
                    <article>
                        <input type="text" placeholder="Resposta correta">
                        <input type="url" placeholder="URL da imagem">
                    </article>
                    <h1>Respostas incorretas</h1>
                    <article>
                        <input type="text" placeholder="Resposta incorreta 1">
                        <input type="url" placeholder="URL da imagem 1">
                    </article>
                    <article>
                        <input type="text" placeholder="Resposta incorreta 2">
                        <input type="url" placeholder="URL da imagem 2">
                    </article>
                    <article>
                        <input type="text" placeholder="Resposta incorreta 3">
                        <input type="url" placeholder="URL da imagem 3">
                    </article>
                </aside>
            </div>
        `
        i++;
    }

}

/* FUNCTION SHOW EDIT BOARD FROM QUESTIONS */

const turnOnOffEditBoard = (question) => {
    let div = question.parentNode

    let buttons = document.querySelectorAll('.editIcon')

    let asides = document.querySelectorAll('.creationPages aside')

    for (let i = 0; i < asides.length; i++) {
        buttons[i].classList.remove('displayNone')
        if (!(asides[i].classList.contains('displayNone'))) {
            asides[i].classList.add('displayNone')
        }
    }
    question.classList.add('displayNone')
    div.children[2].classList.remove('displayNone')

}

/* FUNCTION TO CHECK ALL THE VALUES FROM SECOND PAGE */

const checkValuesSecondPage = () => {

    let divs = document.querySelectorAll('.creationPages div')

    let must = 0;

    let need = 0;

    quizz.questions = []

    let question = {}

    /* Validação das informações */
    for (let i = 0; i < divs.length; i++) {

        question.answers = [];

        let answer1 = {}
        let answer2 = {}
        let answer3 = {}
        let answer4 = {}

        let inputs = divs[i].querySelectorAll('input')

        for (let j = 0; j < inputs.length; j++) {

            /* Texto da pergunta */
            if (inputs[j].placeholder === 'Texto da pergunta') {

                if (inputs[j].value.length >= 20) {
                    question.title = inputs[j].value
                    must++
                }
            }/* Cor de fundo da pergunta */
            else if (inputs[j].placeholder === 'Cor de fundo da pergunta') {

                if (inputs[j].value !== '') {

                    if (isHexColor((inputs[j].value).substring(1))) {
                        question.color = inputs[j].value;
                        must++
                    }
                }
            }/* Resposta certa */
            else if (inputs[j].placeholder === 'Resposta correta') {

                if (inputs[j].value !== '') {
                    answer1.text = inputs[j].value
                    answer1.isCorrectAnswer = true
                    must++

                }
            }/* URL da imagem da resposta certa */
            else if (inputs[j].placeholder === 'URL da imagem') {

                if (checkUrl(inputs[j].value)) {
                    answer1.image = inputs[j].value
                    must++
                }
            }/* Resposta Errada 1 */
            else if (inputs[j].placeholder === 'Resposta incorreta 1') {

                if (inputs[j].value !== '') {
                    answer2.text = inputs[j].value
                    answer2.isCorrectAnswer = false
                }
            }/* URL Resposta Errada 1 */
            else if (inputs[j].placeholder === 'URL da imagem 1') {

                if (checkUrl(inputs[j].value)) {
                    answer2.image = inputs[j].value
                }
            }/* Resposta Errada 2 */
            else if (inputs[j].placeholder === 'Resposta incorreta 2') {

                if (inputs[j].value !== '') {
                    answer3.text = inputs[j].value
                    answer3.isCorrectAnswer = false
                }
            }/* URL Resposta Errada 2 */
            else if (inputs[j].placeholder === 'URL da imagem 2') {

                if (checkUrl(inputs[j].value)) {
                    answer3.image = inputs[j].value
                }
            }/* Resposta Errada 3 */
            else if (inputs[j].placeholder === 'Resposta incorreta 3') {

                if (inputs[j].value !== '') {
                    answer4.text = inputs[j].value
                    answer4.isCorrectAnswer = false
                }
            }/* URL Resposta Errada 3 */
            else if (inputs[j].placeholder === 'URL da imagem 3') {

                if (checkUrl(inputs[j].value)) {
                    answer4.image = inputs[j].value
                }
            }


        }
        /* PUSHING ANSWERS INTO AN ARRAY */
        if (Object.keys(answer1).length === 3) {
            question.answers.push(answer1)
        } if (Object.keys(answer2).length === 3) {
            question.answers.push(answer2)
        } if (Object.keys(answer3).length === 3) {
            question.answers.push(answer3)
        } if (Object.keys(answer4).length === 3) {
            question.answers.push(answer4)
        }

        quizz.questions.push(question)
        question = {}
        answer1 = {}
        answer2 = {}
        answer3 = {}
        answer4 = {}
    }

    /* CHECKING IF THERE ARE ENOUGH ANSWERS */
    for (let z = 0; z < quizz.questions.length; z++) {
        if (quizz.questions[z].answers.length >= 2) {
            need++
        }
    }

    if (must === 4 * divs.length && need === quizz.questions.length) {
        thirdPageCreationQuizz();
    } else {
        alert('Tá Faltando coisa!!!')
    }
    console.log(quizz)
}

/* FUNCTION TO CHECK IF THE COLOR IS A HEX COLOR */

function isHexColor(hex) {
    return typeof hex === 'string'
        && hex.length === 6
        && !isNaN(Number('0x' + hex))
}

/* FUNCTION THAT CREATE THE THIRD PAGE FROM QUIZZ CREATION */

const thirdPageCreationQuizz = () => {

    let main = document.querySelector('main')
    main.innerHTML = `
    <div class="creationPages">
        <h1 class='titleCreationQuizz'>Agora, decida os níveis!</h1>
        <section></section>
        <button onclick="checkValuesThirdPage()">Finalizar Quizz</button>
    </div> `

    let level = quizz.levels
    let i = 0
    let askBoard = document.querySelector('.creationPages section')

    while (i < level) {
        askBoard.innerHTML += `
            <div data-identifier="level">
                <h1>Nível ${i + 1}</h1>
                <ion-icon data-identifier="expand" onclick="turnOnOffEditBoard(this)" class="editIcon" name="construct-outline"></ion-icon>
                <aside class='displayNone'>
                    <input type="text" placeholder="Título do Nível">
                    <input type="number" placeholder="% de acerto mínima">
                    <input type="url" placeholder="URL da imagem do nível">
                    <textarea placeholder="Descrição do nível"></textarea>
                </aside>
            </div>
        `
        i++;
    }

}

/* FUNCTION TO CHECK ALL THE VALUES FROM THIRD PAGE */

const checkValuesThirdPage = () => {

    let aside = document.querySelectorAll('.creationPages aside')

    let level0 = 0

    let must = 0

    quizz.levels = []

    let level = {}

    let levels = []

    for (let i = 0; i < aside.length; i++) {

        const inputsLevels = aside[i].children

        for (let j = 0; j < inputsLevels.length; j++) {

            if (inputsLevels[j].placeholder === 'Título do Nível') {

                if (inputsLevels[j].value.length >= 10) {
                    level.title = inputsLevels[j].value
                    must++
                }
            }
            else if (inputsLevels[j].placeholder === '% de acerto mínima') {

                if (inputsLevels[j].value !== '') {

                    if (Number(inputsLevels[j].value) >= 0 && Number(inputsLevels[j].value) <= 100) {
                        level.minValue = Number(inputsLevels[j].value)
                        must++
                        if (Number(inputsLevels[j].value) === 0) {
                            level0++;
                        }
                    }

                }

            } else if (inputsLevels[j].placeholder === 'URL da imagem do nível') {

                if (checkUrl(inputsLevels[j].value)) {
                    level.image = inputsLevels[j].value
                    must++
                }
            }
            else if (inputsLevels[j].placeholder === 'Descrição do nível') {

                if (inputsLevels[j].value.length >= 30) {
                    level.text = inputsLevels[j].value;
                    must++;
                }
            }

        }
        if (must === (4 * (i + 1))) {
            levels.push(level)
        } else {
            alert('Falta informações.')
        }
        level = {}
    }

    if (levels.length === aside.length) {
        if (level0 !== 1) {
            alert('Necessário ter um valor 0')
        } else {
            quizz.levels = levels;
            let promise = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', quizz)
            promise.then(saveQuizz)
            promise.catch(()=>alert('Erro ao salvar o quizz'))

        }

    }
    console.log(quizz)
}

/* FUNCTION THAT CREATE THE FOURTH PAGE FROM QUIZZ CREATION */

let idActualQuizz

const saveQuizz = (promessa)=>{

    let idQuizz= promessa.data.id
    idActualQuizz = idQuizz;

    let arr=[];
    arr.push(idQuizz);    

    let arrayId = localStorage.getItem('listaId')
    
    if(arrayId ===null){

        let idStr = JSON.stringify(arr)
        localStorage.setItem('listaId', idStr)
    }else{
        
        let getId = JSON.parse(localStorage.getItem('listaId'))
        getId.push(idQuizz)
        let getIdStr = JSON.stringify(getId)
        localStorage.setItem('listaId', getIdStr)
    }
    fourthPageCreationQuizz()
}

const fourthPageCreationQuizz = ()=>{

    
    let main = document.querySelector('main')
    main.innerHTML = `
    <div class="creationPages">
        <h1 class='titleCreationQuizz'>Seu quizz está pronto!</h1>
        <ul>
            <li>
                <img src="${quizz.image}" alt="Quizz Image"> <h2>${quizz.title}</h2>
            </li>
        </ul>
        <button style='margin-top:50px;' onclick="openQuizz(idActualQuizz)">Acessar quizz</button>
        <button id='btnHome' onclick="renderFirstPage()">Voltar para home</button>
    </div> `
}