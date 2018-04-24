<?php

    require_once "PHPMailer/PHPMailerAutoload.php";
    require_once $_SERVER['DOCUMENT_ROOT'] . '/wp-load.php';

    $phone = htmlspecialchars($_POST['phone'], ENT_QUOTES);
    $title = 'Заявка с сайта "' . get_bloginfo('name') . '"';
    $text = "
        <p>Информация о клиенте:</p>
        <p><b>Телефон:</b> $phone.</p>
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
    $result = $mail->send();

    echo json_encode(['error' => $result ? 200 : $mail->ErrorInfo]);
