<?php

namespace App\Http\Controllers;

use App\Models\EmailToken;
use Exception;

class MailSender extends Controller
{

    public function sendEmail($to,$subject,$body){
        
        $from = env('MAIL_FROM_ADDRESS');
        //$from = env('MAIL_FROM_NAME');
        
        $body = $this->appendSignature($body);

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

    private function appendSignature($template){
        $template .= '
        <div style="width: 500px; height: 220px; display: flex; border: 1px solid #ddd; padding: 30px; align-items: center; gap: 30px; font-size: 16px;">
            <div style="width: 80px; height: 80px;  background: url(\'https://sindibr.com.br/favicon.png\') no-repeat center center; background-size: contain;"></div>
    
            <div style=" width: 2px; height: 100%;background-color: #aaa;"></div>
    
            <div style="flex: 1;">
                <div style="font-size: 22px; font-weight: bold; letter-spacing: 2px; text-transform: lowercase;">
                    sindi
                </div>
                <div style="font-size: 12px; margin-top: 3px; margin-bottom: 15px; letter-spacing: 1px; text-transform: lowercase; color: #555;">
                    conectando síndicos, transformando <br> condomínios
                </div>
                <div style=" display: flex; flex-direction: column; gap: 12px; font-size: 16px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>✉️</span> suporte@sindibr.com.br
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>📍</span> Rio de Janeiro, Brasil
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span>🌐</span> sindibr.com.br
                    </div>
                </div>
            </div>
        </div>
        ';

        return $template;
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

    public function sendPaymentEmail($paymentData){
        $user_email = $paymentData['payer']['email'];
        $link = $paymentData['init_point'];
        $template = "
            <div style=\"width:100%\">
                <h1 style=\"text-align:center; font-family:Arial;\">Link para pagamento - Sindi</h1>
                <span style=\"font-family:Arial;\">
                    Você está recebendo este email devido ao contrato assinado em <a href=\"sindibr.com.br\">sindibr.com.br</a>.
                </span>
                <br><br>
                <span style=\"font-family:Arial;\">
                    Para prosseguir com o pagamento <a href=\"$link\">clique aqui</a>
                </span>
                <br><br>
                <i>Você pode encontrar mais informações sobre seu contrato no nosso site, caso necessário, entre em contato com o suporte.</i>
                <br>
            </div>
        ";
        $this->sendEmail($user_email,'Sindi - Link para pagamento',$template);
    }
}
