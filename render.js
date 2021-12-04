/* 複数の処理で使う変数 */
/*************************************************************/
// 問題数
let problemNum;
// 作成した入力ボックス
let answerInputboxes = []
// 正解ファイル
let answerFile

/* 初期化処理 */
/*************************************************************/
window.addEventListener('DOMContentLoaded', () => {
    let lastProblemNum = localStorage.getItem('problemNum')
    if (lastProblemNum != null) {
        problemNum = parseInt(lastProblemNum)
        createAnswerInputboxes()
    }
    const createButton = document.getElementById('btn-create')
    createButton.addEventListener('click', () => {
        localStorage.clear()
        const inputCreate = document.getElementById('input-create')
        problemNum = parseInt(inputCreate.value, 10)
        const score = document.getElementById('score')
        score.value = ""
        localStorage.setItem('problemNum', problemNum)
        createAnswerInputboxes()
    })
    const scoreButton = document.getElementById('btn-score')
    scoreButton.addEventListener('click', updateScore);
    const createCheck = document.getElementById('check-create')
    createCheck.addEventListener('change', toggleCreateButton)

    const answerFileInput = document.getElementById('answerFile')
    answerFileInput.addEventListener('change', updateAnswerFile)

    const autoScoringButton = document.getElementById('btn-auto')
    autoScoringButton.addEventListener('click', () => {
        const reader = new FileReader();
        reader.onload = () => {
            autoScoring(reader.result)
        }
        reader.readAsText(answerFile)
    })
})

/* 入力ボックス作成処理 */
/*************************************************************/
// メイン処理
function createAnswerInputboxes() {
    answerInputboxes = []
    const inputCreate = document.getElementById('input-create')
    inputCreate.disabled = true
    const createButton = document.getElementById('btn-create')
    createButton.disabled = true
    const createCheck = document.getElementById('check-create')
    createCheck.checked = false
    let count = 0;
    let answers = document.getElementById('answers')
    let clone = answers.cloneNode(false)
    answers.parentNode.replaceChild(clone, answers)

    while (count < problemNum) {
        count++
        let answerInputbox = createAnswerInputbox(count)
        clone.appendChild(answerInputbox)
    }
}

// 入力ボックスを1つ作成
function createAnswerInputbox(count) {
    // 属性を設定するヘルパ関数
    function setAttributes(dom, attrs) {
        for (let attr in attrs) {
            dom.setAttribute(attr, attrs[attr])
        }
    }
    let answer = document.createElement('div')
    answer.setAttribute('class', 'col-md-2 col-sm-3 border-top')

    let num = document.createTextNode(count.toString())
    answer.appendChild(num)

    let textbox = document.createElement('input')
    setAttributes(textbox, {
        'class': 'form-control',
        'type': 'text',
        'data-num': count.toString(),
    })
    textbox.addEventListener('keypress', moveNextInputbox)
    textbox.addEventListener('change', updateAnswerInfo)
    const value = localStorage.getItem(count.toString())
    if (value != null) {
        textbox.value = value
    }
    answerInputboxes.push(textbox)
    answer.appendChild(textbox)

    let checkbox = document.createElement('input')
    setAttributes(checkbox, {
        'class': 'form-check-input',
        'type': 'checkbox',
        'id': 'flexCheckDefault'
    })
    checkbox.checked = true

    let label = document.createElement("label")
    label.appendChild(checkbox)
    let text = document.createTextNode("正解")
    label.appendChild(text)
    answer.appendChild(label)

    return answer
}

/* 得点計算 */
/*************************************************************/
function updateScore() {
    const score = document.getElementById('score')
    const count = countCorrectAnswers()
    score.value = `${count}/${problemNum} ${(count / problemNum * 100).toFixed(2)}%`
}

function countCorrectAnswers() {
    const answers = document.getElementById('answers')
    let count = 0;
    for (let answer of answers.children) {
        let checkbox = answer.getElementsByClassName('form-check-input')[0]
        if (checkbox.checked) {
            count++
        }
    }
    return count
}

/* 自動採点機能 */
/*************************************************************/
function updateAnswerFile(event) {
    answerFile = event.target.files[0]
}

function autoScoring(input) {
    const lines = input.trim().split('\n')
    if (lines.length != problemNum) {
        alert('入力ファイルの行数が問題数と異なっています')
        return
    }
    const answers = document.getElementById('answers')
    for (let i = 0; i < answers.children.length; i++) {
        const answer = answers.children[i]
        const line = lines[i]
        const input = answer.getElementsByClassName('form-control')[0]
        const checkbox = answer.getElementsByClassName('form-check-input')[0]
        if (input.value == line) {
            checkbox.checked = true
        } else {
            checkbox.checked = false
        }
    }
    updateScore()
}

/* 入力ボックス間の移動処理 */
/*************************************************************/
function moveNextInputbox(event) {
    const current = parseInt(event.target.dataset.num, 10);
    if (!event.shiftKey && event.key == 'Enter') { // Enter
        answerInputboxes[Math.min(problemNum, current)].focus()
    } else if (event.shiftKey && event.key == 'Enter') { // Shift + Enter
        answerInputboxes[Math.max(0, current - 2)].focus()
    }
}

/* 作成ボタンの無効化・有効化 */
/*************************************************************/
function toggleCreateButton(event) {
    const inputCreate = document.getElementById('input-create')
    const createButton = document.getElementById('btn-create')
    if (event.target.checked) {
        inputCreate.disabled = false
        createButton.disabled = false
    } else {
        inputCreate.disabled = true
        createButton.disabled = true
    }
}

/* 入力した答えをlocalStorageに保存 */
/*************************************************************/
function updateAnswerInfo(event) {
    const target = event.target
    const current = parseInt(target.dataset.num, 10);
    const value = target.value
    localStorage.setItem(current.toString(), value)
}
