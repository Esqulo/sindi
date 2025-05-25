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
            <div style="font-family: \'Lexend Exa\', Arial, sans-serif; color: #000;">

                <link href="https://fonts.googleapis.com/css2?family=Lexend+Exa:wght@100..900&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

                <div style="display: flex; flex-direction: row; align-items: center; box-sizing: border-box; width: 500px; height: 250px; border: 1px solid #ddd; padding: 35px 0;">
                    
                    <div style="display: flex; flex: 1.5; align-items: center; justify-content: center; height: 100%; flex-shrink: 0;">
                    <img src="https://sindibr.com.br/favicon.png" alt="Logo" style="width: 80px; height: 80px; object-fit: cover;" />
                    </div>

                    <div style="display: flex; flex-direction: column; flex: 3; box-sizing: border-box; border-left: 2px solid black; height: 100%; padding: 10px 25px; gap:15px;">
                    
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 22px; font-weight: 500; letter-spacing: 2px;">sindi</span>
                        <span style="font-size: 12px; color: #555;">
                        conectando síndicos, transformando condomínios
                        </span>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 1px; font-size: 13px;">
                        <div style="display: flex; flex-direction: row; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined">mail</span>
                        <span>suporte@sindibr.com.br</span>
                        </div>
                        <div style="display: flex; flex-direction: row; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined">location_on</span>
                        <span>Rio de Janeiro, Brasil</span>
                        </div>
                        <div style="display: flex; flex-direction: row; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined">language</span>
                        <a href="https://sindibr.com.br" style="text-decoration: none; color: #000;" target="_blank">sindibr.com.br</a>
                        </div>
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

    public function sendRecoverPasswordEmail($user_email, $token){

        $link = env("APP_URL")."/setpassword?t=$token";

        $template = "
            <div style=\"width: 100%; font-family: Arial, sans-serif; padding: 30px;\">
                <h2 style=\"text-align: center;\">Redefinição de Senha - Sindi</h2>

                <div style=\"background-color: #ffeb3b; padding: 15px; border-radius: 6px; margin: 20px 0; font-weight: bold;\">
                    ⚠️ Atenção: Não compartilhe este link com ninguém. Ele dá acesso direto à sua conta!
                </div>

                <p>Olá,</p>

                <p>Recebemos uma solicitação para redefinir a sua senha de acesso ao <a href=\"https://sindibr.com.br\" target=\"_blank\" style=\"color: #03a9f4;\">sindibr.com.br</a>.</p>

                <p>Para redefinir sua senha, clique no botão abaixo:</p>

                <div style=\"text-align: center; margin: 30px 0;\">
                    <a href=\"$link\" style=\"background-color: #03a9f4; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;\">Redefinir Senha</a>
                </div>

                <p>ou acesse no link abaixo no seu navegador:</p>
                <br>
                <a href=\"$link\">
                    <span style=\"font-family:Arial; font-size: 16px\">
                        $link
                    </span>
                </a>

                <p>Se você não solicitou essa alteração, apenas ignore este e-mail. Sua senha permanecerá segura.</p>

                <hr style=\"margin: 40px 0; border: none; border-top: 1px solid #444;\">

                <p style=\"font-size: 12px; color: #aaa;\">
                    Este link expira em poucos minutos por motivos de segurança. Caso precise de ajuda, entre em contato com o suporte Sindi.
                </p>
            </div>
        ";

        $this->sendEmail($user_email,'Sindi - Redefinição de senha',$template);
    }
}
