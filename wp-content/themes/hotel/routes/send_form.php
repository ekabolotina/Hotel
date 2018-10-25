<?php

    function checkReCaptcha($response) {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL,"https://www.google.com/recaptcha/api/siteverify");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, [
            'secret' => '6Le0C3YUAAAAAPrlbbRokW--wMwEKmrfHGzbjiB6',
            'response' => $response
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $server_output = curl_exec($ch);
        curl_close($ch);

        if ($output = json_decode($server_output)) {
            return $output->success;
        }

        return false;
    }

    require_once "PHPMailer/PHPMailerAutoload.php";
    require_once $_SERVER['DOCUMENT_ROOT'] . '/wp-load.php';

    $name = htmlspecialchars($_POST['name'], ENT_QUOTES);
    $phone = htmlspecialchars($_POST['phone'], ENT_QUOTES);
    $phoneWithCode = htmlspecialchars($_POST['phone-with-code'], ENT_QUOTES);
    $email = htmlspecialchars($_POST['email'], ENT_QUOTES);
    $message = htmlspecialchars($_POST['message'], ENT_QUOTES);
    $reCaptcha = htmlspecialchars($_POST['g-recaptcha-response'], ENT_QUOTES);
    $title = 'Заявка с сайта "' . get_bloginfo('name') . '"';
    $text = "
        <p>Информация о клиенте:</p>
        <p><b>Имя:</b> $name.</p>
        <p><b>Телефон:</b> $phoneWithCode.</p>
        <p><b>E-mail:</b> $email.</p>
        <p><b>Сообщение:</b> $message.</p>
    ";

    $mail = new PHPMailer;
    $mail->setLanguage('ru');
    $mail->isSMTP();
    $mail->Host = 'smtp.timeweb.ru';
    $mail->SMTPAuth = true;
    $mail->Username = 'noreply@ct37183.tmweb.ru';
    $mail->Password = '8SXmjH2U';
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
    $mail->setFrom('noreply@ct37183.tmweb.ru', 'Noreply');
    $mail->isHTML(true);
    $mail->CharSet = 'utf-8';
    $mail->Subject = $title;

    $mail->Body = '
            <html>
                <header>
                </header>
                <body>
                    <table width="550" align="center" border="0"><tr><td>
                        <h1>'. $title .'</h1>
                        '. $text .'
                        <hr>
                        <div style="font-size: 11px; color: #888;">
                            Письмо отправлено автоматически | <a href="'. home_url() .'">'. get_bloginfo('name') .'</a>.
                        </div>
                    </td></tr></table>
                </body>
            </html>
    ';

    $mail->addAddress(get_field('global_orders_email', 'option'));

    $result = checkReCaptcha($reCaptcha) && $mail->send();

    echo json_encode(['error' => $result ? 200 : 201]);
