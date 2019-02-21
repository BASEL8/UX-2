let model = {
    data: [],
    gamesPlayed: 0,
    currentCorrectAnswers:0,
    currentIncorrectAnswers:0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    correctAnswersPercentage: function () {
        return ((this.correctAnswers / (this.correctAnswers + this.incorrectAnswers) * 100).toFixed(1))
    }
}
let root = document.getElementById('root');
root.innerHTML += `
<div class="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        please answer all the questions
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button id="restart" type="button" class="btn btn-primary" data-dismiss="modal">restart the game</button>
      </div>
    </div>
  </div>
</div>
<button id="warningBtn" type="button" class="btn d-none btn-primary" data-toggle="modal" data-target="#Modal">
</button>

`
function gameScreen() {
    let div = document.createElement('div');
    div.id = 'GameScreen';
    let startBtn = document.createElement('button');
    startBtn.id = 'start';
    startBtn.textContent = 'start';
    startBtn.classList = 'btn btn-raised btn-danger';
    let form = document.createElement('form')
    let questionsDiv = document.createElement('div');
    questionsDiv.id = 'questions';
    let submitBtn = document.createElement('button');
    submitBtn.id = 'submitBtn';
    submitBtn.classList = 'btn btn-danger btn-raised';
    submitBtn.textContent = 'submit';
    submitBtn.type = 'submit';
    form.appendChild(submitBtn);
    form.prepend(questionsDiv);
    div.appendChild(startBtn);
    div.appendChild(form);
    $('#gameScreen').append(div);
    $('#questions').parent().hide()
    $('#start').click(function () {
        model.data = [];
        model.currentCorrectAnswers = 0;
        model.currentIncorrectAnswers = 0;
        model.gamesPlayed += 1;
        $('#questions').html(' ');
        $(this).hide()
        $.get('https://opentdb.com/api.php?amount=10&category=12&difficulty=easy&type=multiple', function (data) {
                data.results.forEach((d, i) => {
                    let allAnswer = d.incorrect_answers;
                    allAnswer.splice(Math.floor((Math.random() * allAnswer.length)), 0, d.correct_answer)
                    model.data.push({
                        allAnswer: allAnswer,
                        correct: d.correct_answer,
                        question: d.question,
                        id: `q-${i}`
                    })
                })
                model.clicks = data.results.length;
            }).then(function () {
                model.data.forEach((q, i) => {
                    $('#questions').append(
                        `  
                <div class="question">
                <h6 tabindex="0">Question-${i+1} : ${q.question}</h6>
                <div class="form-group answers" id=${q.id}>
                ${q.allAnswer.map((a)=>{
                    return ` 
                    <div class="radio">
                    <label>
                     <input type="radio" name="${i}" value="${a}" required>
                     <span class="bmd-radio"></span>
                 ${a}
                </label>
              </div>
              
                    `
                }).join('')}
              </div>
              </div>
           `
                    )
                });
                $('#questions').parent().show()
            })
            .then(function () {
                $('#submitBtn').click(function (e) {
                    e.preventDefault();
                    if ($("#GameScreen input:checked").length === model.data.length) {
                      $.each($("#GameScreen input:checked"),function(i,v){
                        if(model.gamesPlayed * model.data.length > model.correctAnswers + model.incorrectAnswers){
                        if(v.value===model.data[i].correct){
                            model.correctAnswers += 1;
                            model.currentCorrectAnswers += 1;
                            $(v).siblings().addClass('done');                            
                        }else{
                            model.incorrectAnswers += 1;
                            model.currentIncorrectAnswers += 1;
                            $(v).siblings().addClass('wrong');
                            $(v).closest('.answers').find('input').filter(function() { return this.value == model.data[i].correct}).parent().css('color','rgb(0, 177, 0)')
                        }}
                      })

                        $('#Modal .modal-body').html(`
                        <h6>game played : ${model.gamesPlayed}</h6>
                        <h6>current correct answers : ${model.currentCorrectAnswers}<h6>
                        <h6>current wrong answers : ${model.currentIncorrectAnswers}</h6>
                        <h6>wrong answers : ${model.incorrectAnswers}</h6>
                        <h6>correct answers : ${model.correctAnswers}<h6>
                        <h6>Correct Answer Percentage : ${model.correctAnswersPercentage()}%</h6>
                        `)
                        $('#restart').show()
                        $('#warningBtn').click();
                        state();
                        $('#restart').click(function () {
                            model.data = [];
                            $('#start').show();
                            $('#questions').parent().hide()
                        });
                    } else {
                        $('#Modal .modal-body').text('please answers all the questions')
                        $('#warningBtn').click();
                        $('#restart').hide()
                    }
                })
            })
    })

}
function state() {
    $('#state').html(`
    <div class="d-flex flex-column">
    <h1> game state</h1>
    <h6>Games Played : ${model.gamesPlayed}</h6>
    <h6>Correct Answers: ${model.correctAnswers}</h6>
    <h6>Incorrect Answers : ${model.incorrectAnswers}</h6>
    <h6>Correct Answer Percentage : ${model.correctAnswersPercentage()}%</h6>
    </div>
    `)
}
gameScreen();
$('ul.tabs').each(function(){
    var active, content, links = $(this).find('a');
    active = $(links.filter('[href="'+location.hash+'"]')[0] || links[0]);
    active.addClass('active');
    content = $(active[0].hash);
    links.not(active).each(function () {
      $(this.hash).hide();
    });
    $(this).on('click', 'a', function(e){
      active.removeClass('active');
      content.hide();
        active = $(this);
      content = $(this.hash);
      active.addClass('active');
      content.show();
        e.preventDefault();
    });
  });




