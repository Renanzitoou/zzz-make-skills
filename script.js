const editor = document.getElementById("editor");
const preview = document.getElementById("preview");

editor.addEventListener("input", updatePreview);

function updatePreview(){
    preview.innerHTML = editor.innerHTML;
}

/* ===== TEXTO ===== */

function wrap(className){
    const selection = window.getSelection();
    if(!selection.rangeCount) return;

    const span = document.createElement("span");
    span.className = className;
    span.textContent = selection.toString();

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);

    updatePreview();
}

function boldText(){
    document.execCommand('bold', false, null);
    updatePreview();
}

/* ===== ICONES VIA LINK ===== */

const iconLinks = {
    basic: "https://cdn.gachabase.net/prod/zzz/assets/15317334708392014940_250_13063804.webp",
    special: "https://cdn.gachabase.net/prod/zzz/assets/2297531228866436950_250_13063804.webp",
    assist: "https://cdn.gachabase.net/prod/zzz/assets/2454651411643363052_250_13063804.webp",
    dodge: "https://cdn.gachabase.net/prod/zzz/assets/5161803192951478865_250_13063804.webp",
    ultimate: "https://cdn.gachabase.net/prod/zzz/assets/1387329758178637252_250_13063804.webp",
    main: "https://cdn.gachabase.net/prod/zzz/assets/13601113206450624428_250_13063804.webp"
};

function insertIcon(type){
    const url = iconLinks[type];
    if(!url) return;

    const img = document.createElement("img");
    img.src = url;
    img.className = "icon";

    const range = window.getSelection().getRangeAt(0);
    range.insertNode(img);

    updatePreview();
}

///formatar texto

// Formata todo o texto, limpa formatação mas mantém quebras de linha
function formatAllText() {
    const text = editor.innerText; // pega texto puro com quebras de linha
    const lines = text.split(/\n/); // separa por linha

    // Limpa editor
    editor.innerHTML = "";

    // Cria spans ou divs para cada linha com <br> para manter visual
    lines.forEach((line, index) => {
        const span = document.createElement("span");
        span.textContent = line;
        editor.appendChild(span);
        if (index < lines.length - 1) {
            editor.appendChild(document.createElement("br"));
        }
    });

    updatePreview();
}

/* ===== EXPORTAR PNG ===== */

async function exportImage(){

    updatePreview();

    const canvas = await html2canvas(preview,{
        backgroundColor:null,
        scale:2
    });

    const link = document.createElement("a");
    link.download = "zzz-text.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

/* ===== COPIAR IMAGEM ===== */

async function copyImage(){

    // garante que o preview está atualizado
    updatePreview();

    const canvas = await html2canvas(preview, {
        backgroundColor: null,
        scale: 2
    });

    canvas.toBlob(async (blob) => {

        if(!blob){
            alert("Erro ao copiar.");
            return;
        }

        try{
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
            ]);
            alert("Imagem copiada!");
        }catch(err){
            alert("Seu navegador bloqueou a cópia.");
            console.error(err);
        }

    });

}


/// preview

async function exportImage(){

    const clone = preview.cloneNode(true);

    // Remove imagens externas
    clone.querySelectorAll("img").forEach(img=>{
        if(!img.src.startsWith(window.location.origin)){
            img.remove();
        }
    });

    document.body.appendChild(clone);
    clone.style.position = "absolute";
    clone.style.left = "-9999px";

    const canvas = await html2canvas(clone, {
        backgroundColor: null,
        scale: 2
    });

    document.body.removeChild(clone);

    const link = document.createElement("a");
    link.download = "zzz-text.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

}
