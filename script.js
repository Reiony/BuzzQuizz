
/* Pushing quizzes from API - BuzzQuizz */

function getQuizz(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(renderQuizz)
    promise.catch(functionerror)
}

function renderQuizz(elem){
    const searchUl=document.querySelector("ul");
    console.log (elem)
    console.log (elem.data)
    const QuizzList = elem.data;
    QuizzList.forEach(element => {
        searchUl.innerHTML += `<li id=${element.id}>
        <img src="${element.image}"> <h2>${element.title}</h2> 
      </li>`
        
    });
}
getQuizz();

/* FUNCTION THAT CREATE THE FIRST PAGE FROM QUIZZ CREATION */

function firstPageCreationQuizz (){
    const get1stpage=document.querySelector(".firstpage")
    get1stpage.classList.add(".displayNone");
    let main = document.querySelector('main');
    main.innerHTML= `
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

/* FUNCTION TO CHECK IF A STRING IS AN URL */

const checkUrl = (string)=> {
    try {
     let url = new URL(string)
     return true;
   } catch(err) {
       return false;
   }
 }

const quizz = {}

/* FUNCTION STARTS TO CREATE THE QUIZZ OBJECT AND CALLS secondPageCreationQuizz */

const startCreationQuizz = ()=>{

    const inputs = document.querySelector('.inputs')
    const titleQuizz = inputs.children[0].value
    const urlQuizz = inputs.children[1].value
    const qtdAsksQuizz = inputs.children[2].value
    const qtdLevelQuizz = inputs.children[3].value

    if (titleQuizz.length > 65 || titleQuizz<20){
        alert('Titulo errado')
    }else if (!checkUrl(urlQuizz)){
        alert('URL Inválida')
    }else if (qtdAsksQuizz<3){
        alert('A quantidade de perguntas precisa ser maior ou igual a 3!')
    }else if (qtdLevelQuizz<2){
        alert('A quantidade de niveis precisa ser maior ou igual a 2!')
    }else{

        quizz.title = titleQuizz
        quizz.image = urlQuizz
        quizz.questions = Number(qtdAsksQuizz)
        quizz.levels = Number(qtdLevelQuizz)
        secondPageCreationQuizz()
        
    }
}
  
/* FUNCTION THAT CREATE THE SECOND PAGE FROM QUIZZ CREATION */

const secondPageCreationQuizz = ()=>{
    let questions = quizz.questions
    let main = document.querySelector('main');

    main.innerHTML= `
        <div class="creationPages">
            <h1 class='titleCreationQuizz'>Crie suas perguntas</h1>
            <section></section>
            <button onclick="">Prosseguir pra criar niveis</button>
        </div>  
    `
    let i =0
    let askBoard = document.querySelector('.creationPages section')

    while(i<questions){
        askBoard.innerHTML+=`
            <div>
                <h1>Pergunta ${i+1}</h1>
                <ion-icon onclick="turnOnOffEditBoard(this)" class="editIcon" name="construct-outline"></ion-icon>
                <aside class='displayNone'>
                    <article>
                        <input type="text" placeholder="Texto da pergunta">
                        <input type="color">
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

const turnOnOffEditBoard = (question)=>{
    let div = question.parentNode
    
    let buttons = document.querySelectorAll('.editIcon')

    let asides = document.querySelectorAll('.creationPages aside')

    for (let i =0; i<asides.length;i++){
        buttons[i].classList.remove('displayNone')
        if(!(asides[i].classList.contains('displayNone'))){
            asides[i].classList.add('displayNone')
        }
    }
    question.classList.add('displayNone')
    div.children[2].classList.remove('displayNone')

}