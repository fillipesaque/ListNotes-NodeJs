import fs from "node:fs"
import path from "node:path"
import  readline  from "node:readline"
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notesDirectory = path.join(__dirname , "notes")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function initializeNotesDirectory () {
    if (!fs.existsSync(notesDirectory)) {
        fs.mkdirSync(notesDirectory)
    }
}

function listNotes () {
    const notes = fs.readdirSync(notesDirectory)

    if (notes.length === 0) {
         console.log("Nenhuma Nota Salva No Momento")
    }else{
        console.log("Notas Salvas")
        notes.forEach((note , index) => {
        console.log(`${index + 1}. ${note}`)
        })
    }
    
}

function readNote () {
    listNotes()

    rl.question("Digite o numero da nota que deseja ler:" , (index) => {
        const notes = fs.readdirSync(notesDirectory)
        const selectedNote = notes[index -1]

        if (!selectedNote) {
            console.log("numero da nota invalida")
        } else {
            const notePath = path.join(notesDirectory , selectedNote)
            const content = fs.readFileSync(notePath , "utf-8")
            console.log(`Conteudo da Nota "${selectedNote}":\n\n${content}`)
        }   
        askForNextAction()    
    })
}

function createNote () {
    rl.question("Digite o nome da nota" , (noteName) => {
        const notePath = path.join(notesDirectory , noteName)

        rl.question("Digite o conteuda da nota: \n" , (content) => {
            fs.writeFileSync(notePath + ".txt" ,content , "utf-8")
            console.log(`Nota ${noteName} foi criada com sucesso!`)

            askForNextAction()
        })
    })
}

function deleteNote () {
    listNotes()

    rl.question("Digite o numero da nota que deseja excluir:" , (index) => {
        const notes = fs.readdirSync(notesDirectory)
        const selectedNote = notes[index -1]

        if (!selectedNote) {
            console.log("Numero da nota Invalido")
        }else {
            const notePath = path.join(notesDirectory , selectedNote)
            fs.unlinkSync(notePath)
            console.log(`Nota "${selectedNote}" excluida com sucesso!`)
        }
        askForNextAction()
    })
}

function askForNextAction () {
    rl.question("\n Deseja Realizar outra açao ? (s/n)" , (answer) => {
        if (answer.toLocaleLowerCase() === "s") {
            main()
        }else {
            console.log("Encerrando Aplicaçao ...")
            rl.close()
            process.exit(0)
        }
    })
}

function main () {
    initializeNotesDirectory()

    console.clear()
    console.log("---------------------------------")
    console.log("Notas Rapidas no Terminal v1.0")
    console.log("---------------------------------")

    console.log("Escolha Uma Opçao!")
    console.log("1. Listar Notas")
    console.log("2. Ler Uma Nota")
    console.log("3. Criar Uma Nota")
    console.log("4. Excluir Uma Nota")
    console.log("5. Sair")

    rl.question("Digite o Numero Da Opçao desejada: " , (option) => {
        switch (option) {
            case "1":
                listNotes()
                askForNextAction()
                break;
            case "2":
                readNote()
                break;
            case "3":
                createNote()
                break;
            case "4":
                deleteNote()
                break;
            case "5":
                console.log("Saindo ...")
                rl.close()
                process.exit(0)
            default:
                console.log("Opçao Invalida")
                break;
        }
    })
}

main()