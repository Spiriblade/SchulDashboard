document.addEventListener("DOMContentLoaded", () => {

    const navigationItems = document.querySelectorAll(".nav-item");
    const dashboardCards = document.querySelectorAll(".dashboard-card");

    const dashboardView = document.getElementById("dashboard-view");
    const feedbackView = document.getElementById("feedback-view");
    const settingsView = document.getElementById("settings-view");

    const backButton = document.getElementById("back-to-dashboard");

    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const fileList = document.getElementById("file-list");
    const fileCount = document.getElementById("file-count");

    const runButton = document.getElementById("run-analysis");

    const togglePromptButton = document.getElementById("toggle-prompt");
    const promptPanel = document.getElementById("prompt-panel");
    const savePromptButton = document.getElementById("save-prompt");
    const promptInput = document.getElementById("analysis-prompt");

    const resultArea = document.getElementById("result-area");
    const resultStatus = document.getElementById("result-status");

    let selectedFiles = [];

    const defaultPrompt = promptInput.value;


    /*
     * =========================
     * Ansichten
     * =========================
     */

    function showView(viewName) {

        dashboardView.classList.remove("active-view");
        feedbackView.classList.remove("active-view");
        settingsView.classList.remove("active-view");

        if (viewName === "dashboard") {
            dashboardView.classList.add("active-view");
        }

        if (viewName === "feedback") {
            feedbackView.classList.add("active-view");
        }

        if (viewName === "settings") {
            settingsView.classList.add("active-view");
        }
    }


    function setActiveNavigation(viewName) {

        navigationItems.forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.view === viewName
            );

        });
    }


    /*
     * =========================
     * Navigation
     * =========================
     */

    navigationItems.forEach(item => {

        item.addEventListener("click", () => {

            const view = item.dataset.view;

            showView(view);
            setActiveNavigation(view);

        });

    });


    /*
     * =========================
     * Dashboard-Kacheln
     * =========================
     */

    dashboardCards.forEach(card => {

        card.addEventListener("click", () => {

            if (card.dataset.action === "feedback") {

                showView("feedback");

                // Dashboard bleibt als Hauptnavigation ausgewählt,
                // während die Detailansicht geöffnet ist.
                setActiveNavigation("dashboard");

            }

        });

    });


    /*
     * =========================
     * Zurück zum Dashboard
     * =========================
     */

    backButton.addEventListener("click", () => {

        showView("dashboard");

        setActiveNavigation("dashboard");

    });


    /*
     * =========================
     * Dateien hinzufügen
     * =========================
     */

    function addFiles(files) {

        const validFiles = Array.from(files).filter(file => {

            const name = file.name.toLowerCase();

            return (
                name.endsWith(".docx") ||
                name.endsWith(".xlsx")
            );

        });


        validFiles.forEach(file => {

            const alreadyExists = selectedFiles.some(existingFile => {

                return (
                    existingFile.name === file.name &&
                    existingFile.size === file.size &&
                    existingFile.lastModified === file.lastModified
                );

            });


            if (!alreadyExists) {

                selectedFiles.push(file);

            }

        });


        renderFileList();

    }


    /*
     * =========================
     * Dateiliste anzeigen
     * =========================
     */

    function renderFileList() {

        fileList.innerHTML = "";


        selectedFiles.forEach((file, index) => {

            const item = document.createElement("div");

            item.className = "file-item";


            const extension =
                file.name.toLowerCase().endsWith(".docx")
                    ? "DOCX"
                    : "XLSX";


            item.innerHTML = `
                <span class="file-type">${extension}</span>

                <span
                    class="file-name"
                    title="${escapeHtml(file.name)}"
                >
                    ${escapeHtml(file.name)}
                </span>
            `;


            /*
             * Doppelklick entfernt eine Datei.
             */

            item.addEventListener("dblclick", () => {

                selectedFiles.splice(index, 1);

                renderFileList();

            });


            fileList.appendChild(item);

        });


        /*
         * Anzahl Dateien aktualisieren
         */

        if (selectedFiles.length === 1) {

            fileCount.textContent = "1 Datei";

        } else {

            fileCount.textContent =
                `${selectedFiles.length} Dateien`;

        }


        /*
         * Ausführen erst ermöglichen,
         * wenn mindestens eine Datei vorhanden ist.
         */

        runButton.disabled =
            selectedFiles.length === 0;

    }


    /*
     * =========================
     * HTML absichern
     * =========================
     */

    function escapeHtml(value) {

        return value
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /*
     * =========================
     * Datei auswählen
     * =========================
     */

    dropZone.addEventListener("click", () => {

        fileInput.click();

    });


    fileInput.addEventListener("change", event => {

        addFiles(event.target.files);

        // Damit dieselbe Datei später erneut ausgewählt
        // werden kann.
        fileInput.value = "";

    });


    /*
     * =========================
     * Drag & Drop
     * =========================
     */

    ["dragenter", "dragover"].forEach(eventName => {

        dropZone.addEventListener(eventName, event => {

            event.preventDefault();

            dropZone.classList.add("drag-over");

        });

    });


    ["dragleave", "drop"].forEach(eventName => {

        dropZone.addEventListener(eventName, event => {

            event.preventDefault();

            dropZone.classList.remove("drag-over");

        });

    });


    dropZone.addEventListener("drop", event => {

        addFiles(event.dataTransfer.files);

    });


    /*
     * =========================
     * Prompt anzeigen / verstecken
     * =========================
     */

    togglePromptButton.addEventListener("click", () => {

        const isHidden =
            promptPanel.classList.toggle("hidden");


        if (isHidden) {

            togglePromptButton.textContent =
                "Prompt anzeigen";

        } else {

            togglePromptButton.textContent =
                "Prompt ausblenden";

        }

    });


    /*
     * =========================
     * Prompt speichern
     * =========================
     */

    savePromptButton.addEventListener("click", () => {

        resultStatus.textContent =
            "Prompt gespeichert";


        setTimeout(() => {

            resultStatus.textContent =
                "Bereit";

        }, 1500);

    });


    /*
     * =========================
     * Analyse ausführen
     * =========================
     *
     * Momentan noch keine echte KI-Anbindung.
     *
     * Hier wird später:
     *
     * Dateien
     * +
     * Prompt
     * ↓
     * Backend
     * ↓
     * KI / AIS.chat
     *
     * übertragen.
     */

    runButton.addEventListener("click", () => {

        if (selectedFiles.length === 0) {

            return;

        }


        const prompt =
            promptInput.value.trim() ||
            defaultPrompt;


        /*
         * Informationen über die ausgewählten
         * Dateien vorbereiten.
         */

        const fileData = selectedFiles.map(file => {

            return {

                name: file.name,

                type:
                    file.name
                        .toLowerCase()
                        .endsWith(".docx")
                        ? "docx"
                        : "xlsx",

                size: file.size,

                lastModified:
                    file.lastModified

            };

        });


        /*
         * Diese Struktur kann später direkt
         * an unser Backend übergeben werden.
         */

        const analysisRequest = {

            prompt: prompt,

            files: fileData

        };


        /*
         * Zum Testen momentan nur in der
         * Browser-Konsole ausgeben.
         */

        console.log(
            "Vorbereitete KI-Anfrage:",
            analysisRequest
        );


        /*
         * Status aktualisieren.
         */

        resultStatus.textContent =
            "Analyse vorbereitet";


        /*
         * Vorläufiges Ergebnis anzeigen.
         */

        resultArea.innerHTML = `

            <div class="analysis-message">

                <strong>
                    Analyse vorbereitet
                </strong>

                <br><br>

                ${fileData.length}
                Datei(en) wurden ausgewählt
                und für die spätere KI-Anbindung
                zusammengestellt.

                <br><br>

                <strong>
                    Prompt:
                </strong>

                <br>

                ${escapeHtml(prompt)}

                <br><br>

                <span>
                    Die eigentliche Verarbeitung von
                    DOCX/XLSX und die KI-Anfrage werden
                    später über das Backend angeschlossen.
                </span>

            </div>

        `;

    });


    /*
     * =========================
     * Anfangszustand
     * =========================
     */

    runButton.disabled = true;

    promptInput.value = defaultPrompt;

});
