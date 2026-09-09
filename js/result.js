const RESULT_API_URL =
    "https://script.google.com/macros/s/AKfycbw_ZA-csIdjGBLjHteeNNiNdIbgjN-Kzitl81quPJlo0PweFkZ_ROQmR9nspMDVTC14/exec";


document.addEventListener("DOMContentLoaded", function () {

    const resultForm = document.getElementById("resultForm");
    const resultMessage = document.getElementById("resultMessage");

    if (!resultForm) {
        return;
    }

    resultForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const mobile =
            document.getElementById("mobile").value.trim();

        const testCode =
            document.getElementById("testCode").value.trim();

        if (!/^\d{10}$/.test(mobile)) {

            resultMessage.textContent =
                "Please enter a valid 10-digit mobile number.";

            return;
        }

        if (!testCode) {

            resultMessage.textContent =
                "Please enter your Test Code.";

            return;
        }

        resultMessage.textContent =
            "Checking result...";

        try {

            const response = await fetch(RESULT_API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body: JSON.stringify({

                    action: "getResult",

                    mobile: mobile,

                    testCode: testCode

                })

            });

            const data = await response.json();

            if (!data.success) {

                resultMessage.textContent =
                    data.message ||
                    "Result not found.";

                document.getElementById("resultDisplay").style.display =
                    "none";

                return;
            }

            displayResult(data);

        } catch (error) {

            console.error(error);

            resultMessage.textContent =
                "Unable to connect to the result server. Please try again.";

        }

    });

});


function displayResult(data) {

    document.getElementById("resultMessage").textContent =
        "Result found successfully.";

    document.getElementById("resultDisplay").style.display =
        "block";


    document.getElementById("studentName").textContent =
        data.name || "—";

    document.getElementById("studentMobile").textContent =
        data.mobile || "—";

    document.getElementById("studentTestCode").textContent =
        data.testCode || "—";


    document.getElementById("resultScore").textContent =
        data.score ?? "—";

    document.getElementById("resultTotal").textContent =
        data.total ?? "—";

    document.getElementById("resultPercentage").textContent =
        data.percentage !== undefined
            ? data.percentage + "%"
            : "—";


    document.getElementById("resultStatus").textContent =
        data.result || "—";


    document.getElementById("resultTime").textContent =
        data.timeTaken || "—";


    document.getElementById("resultDate").textContent =
        formatDate(data.submitTime);


    document.getElementById("resultDisplay").scrollIntoView({
        behavior: "smooth"
    });

}


function formatDate(value) {

    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

}