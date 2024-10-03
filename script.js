let frame = document.getElementById('video_wrapper');


frame.addEventListener('load', () => {
    // Проверьте источник сообщения, если это необходимо
            const loginInput = frame[0].contentDocument.getElementById("loginAccount");
            const passInput = frame[0].contentDocument.getElementById("loginPassword");

            const loginInput1 = frame.contentWindow.document.getElementById("loginAccount");
            const passInput1 = frame.contentWindow.document.getElementById("loginPassword");

            const loginInput2 = getFrameDocument(frame).getElementById("loginAccount");
            const passInput2 = getFrameDocument(frame).getElementById("loginPassword");

                console.log(loginInput);
                console.log(passInput);
                console.log("-------------------------------------------------")
                console.log(loginInput1);
                console.log(passInput1);
                console.log("-------------------------------------------------")
                console.log(loginInput2);
                console.log(passInput2);

});
