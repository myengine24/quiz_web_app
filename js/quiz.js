// #1 mengekstrak nomor acak
let randomizeQuestion = arr => {
    return Math.floor(Math.random() * arr.length)
}

// mengambil index acak berdasarkan fungsi "randomizeQuestion"
let getCurrentPosition = source => {
    return source.map(source => {
        let randomIndex = randomizeQuestion(source["quiz"])
        return source["quiz"][randomIndex]
    })
}

// #2 mengambil daftar jawaban
let getListAnswer = selectedSource => {
    // id unik untuk masing-masing pertanyaan
    let qId = selectedSource["question_id"]
    // daftar jawaban --> format object
    let answer = selectedSource["answer_list"]
    // looping untuk masing-masing jawaban --> masukan dalam struktur html (input)
    // looping berdasarkan key dari jawaban: {a: ...., b: ....., c: .....}
    let list = Object.keys(answer).map(key => {
        return `
        <li class="list-group-item">
            <input id="${qId + key}" type="checkbox" onclick="singleCheckbox(this.id)" class="custom-control-input answer-option" value="${key}" name="${key}">
            <label class="custom-control-label" for="${qId + key}">${key + ". " + answer[key]}</label>
        </li>
        `
    })
    // buat input tipe hidden untuk memasukan jawaban yang benar
    let correctAnswer = `
        <input id="correct-${qId}" type="hidden" class="custom-control-input correct-answer" value="${selectedSource["correct_answer"]}">
    `
    // push input jawaban yang benar ke html daftar jawaban
    list.push(correctAnswer)
    // retrun string dari struktur html
    return list.join("")
}

// #3 membuat struktur html --> contoh "card" dari Bootstrap
let getHtmlStructure = selectedSource => {
    // looping data soal yang telah teracak
    return selectedSource.map(source => {
        // ambil daftar jawaban dari soal yang telah teracak
        let lisOfAnswer = getListAnswer(source)
        return `
        <div class="card">
                <div class="card-header">
                Pertanyaan No. ${source["question_num"]}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${source["question"]}</h5>
                    <p class="card-text">Pilihan Jawaban : </p>
                        ${lisOfAnswer}
                    <br>
                    <button id="buttonSubmitAnswer-${source["question_num"]}" type="button" class="btn btn-sucsess btn-submit-answer" disabled=true>Kunci Jawaban</button>
                </div>
            </div>
            `
    }).join("")
}

// global counter
let count = 1

// #4 fungsionalitas dari setiap soal
let getCard = () => {
    // komponen html di mana soal dan jawaban 
    let card = document.querySelectorAll(".card")
    // aktifkan "card" soal pada index pertama
    card[0].classList.add("active")

    // tombol submit untuk masing-masing soal
    let btn = document.querySelectorAll(".card .btn")
    // query jawaban benar dari input tipe hidden
    let inputCorrect = document.querySelectorAll(".correct-answer")
    // looping tombol di masing-masing "card"
    btn.forEach((b, i) => {
        // onclick event
        b.addEventListener("click", () => {
            // set "display none" untuk semua "card", kecuali yang pertama,
            // yang dimunculkan pada awal game (line 72)
            card.forEach(c => {
                c.classList.remove("active")
            })
            // filter semua checkbox di jawaban dengan dan pilih "true", 
            // untuk jawaban yang dicentang
            let selected = [...card[i].querySelectorAll(".answer-option")].filter(input => input.checked == true)
            // set nilai untuk jawaban yang dicentang dan jawaban yang benar
            selected = selected[0].value
            correct = inputCorrect[i].value
            // kondisi untuk validasi jawaban
            if (selected === correct) {
                alert("Selamat, jawaban anda benar!")
                // increament counter --> digunkan untuk melakukan tracking
                // urutan atau nomor soal
                count += 1
                // jika total counter sudah di atas jumlah soal, maka game selesai
                if (count === card.length + 1) {
                    // munculkan "congratulation" word
                    document.getElementById('congratsWord').classList.add("active")
                } else {
                    // kalau soal belum selesai, set kelas "active"
                    // untuk soal selanjutnya
                    card[i + 1].classList.add("active")
                }
                // jika jawaban salah, kembalikan ke awal
            } else {
                alert("Maaf, jawaban anda belum tepat!")
                location.reload()
            }
        })
    })
}

// #5 menjalankan kuis, dimulai dengan memasukan elemen html yang sudah 
// diekstrak sebelumnya
let runQuiz = html => {
    // masukan soal ke "div"
    document.getElementById('quiz').innerHTML = html
    // deklarasikan fungsi "getCard" untuk menjalankan semua
    // fungsi
    getCard()
}

// #6 single checkbox selection 
let singleCheckbox = id => {
    let className = ".custom-control-input"
    let inputs = document.querySelectorAll(className)
    // set semua check box dalam posisi falses
    inputs.forEach(input => {
        input.checked = false
    })
    // set clicked checkbox
    document.getElementById(id).checked = true
    // jalan fungsi checking untuk memastikan checkbox tidak "kosong" / tidak 
    checkChecked(inputs)
}

// #7 pengecekan checkbox
let checkChecked = (inputs) => {
    // pilih tombol pada "current card" 
    // target: tombol submit pada "card" dengan kelas "active"
    let btn = document.querySelector(".active .card-body .btn-submit-answer")
    // jalankan looping: jika ada input yang dicentang, maka "attribute disabled"
    // pada tombol di set = true
    inputs.forEach(input => {
        if (input.checked == true) {
            // jika ada centang, check "disabled button" ke false
            btn.disabled = false
        }
    })
}

// #8 komparasi jawaban
let compareAnswer = (selected, correct) => {
    return selected === correct ? true : false
}

// #9 tombol reload, pada "congrats section" 
let Reload = () => {
    location.reload()
}

// #10 panggil data, dan jalankan semua fungsinya 
fetch('assets/4quiz.json')
    .then(response => response.json())
    .then(json => {
        // data terfilter secara acak
        let currentData = getCurrentPosition(json)
        // struktur HTML
        let htmlStructure = getHtmlStructure(currentData)
        // jalankan kuis
        runQuiz(htmlStructure)
    })