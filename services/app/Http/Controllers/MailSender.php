<?php

namespace App\Http\Controllers;

use App\Models\EmailToken;
use Exception;

class MailSender extends Controller
{

    public function sendEmail($to,$subject,$body){
        
        $from = env('MAIL_FROM_ADDRESS');
        //$from = env('MAIL_FROM_NAME');
        
        $headers = 
            "From: <$from>\r\n".
            "Reply-To: <$from>\r\n".
            "X-Mailer: PHP/".phpversion()."\r\n".
            "MIME-Version: 1.0\r\n".
            "Content-type:text/html;charset=UTF-8";

        try{
            mail($to,$subject,$body,$headers);
            return true;
        }catch(Exception $e){
            return false;
        }

    }

    public function sendEmailConfirmation($user_id){

        $user_email = $this->getUserEmail($user_id);

        EmailToken::where('user_id', $user_id)->update(['expired_by_another' => 1]);

        $now = date("Y-m-d H:i:s");
        $expires = date("Y-m-d H:i:s", strtotime('+2 Hours'));
        $token = md5($now.rand(0,99999).rand(0,99999));

        EmailToken::create([
            'user_id' => $user_id,
            'code' => $token,
            'expires_at' => $expires
        ]);

        $link = "http://sindibr.com.br/confirmarEmail?t=$token";

        $template = "
            <div style=\"width:100%\">
                <h1 style=\"text-align:center; font-family:Arial;\">Confirmação de e-mail</h1>
                <span style=\"font-family:Arial;\">
                    Você está recebendo este email pois uma tentativa de cadastrar
                    o seu email foi realizada no em <a href=\"sindibr.com.br\">sindibr.com.br</a>.
                </span>
                <br><br>
                <span style=\"font-family:Arial;\">
                    Para confirmar a ação <a href=\"$link\">clique aqui</a>
                    ou acesse no link abaixo no seu navegador:
                </span>
                <br><br>
                <a href=\"$link\">
                    <span style=\"font-family:Arial; font-size: 16px\">
                        $link    
                    </span>
                </a>
                <br>
                <p style=\"width: 100%; padding: 20px 0; text-align:center;  background: #fff200; color:#000; font-family:Arial;\">
                    <b>ATENÇÃO: NÃO COMPARTILHE O LINK COM NINGUÉM.</b>
                </p>
                <br>
                <i>Caso não tenha não tenha solicitado o cadastro, 
                alguém pode ter digitado o seu endereço por engano. Mesmo assim,
                sugerimos revisar a segurança do seu email.</i><br>
            </div>
        ";

        $this->sendEmail($user_email,'Sindi - Confirmação de email',$template);

    }

}
