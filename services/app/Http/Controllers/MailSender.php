<?php

namespace App\Http\Controllers;

use App\Models\EmailToken;
use Exception;

class MailSender extends Controller
{
    private function buildEmail($subject,$body){

        $signature = $this->buildSignature();

        return  "
            <!DOCTYPE html>
            <html lang=\"pt-BR\">
                <head>
                    <title>$subject</title>
                    <meta charset=\"UTF-8\">
                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                    <link href=\"https://fonts.googleapis.com/css2?family=Lexend+Exa:wght@100..900&display=swap\" rel=\"stylesheet\">
                    <link href=\"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined\" rel=\"stylesheet\" />
                </head>
                <body>
                    $body
                </body>
                <footer>
                    $signature
                </footer>
            </html>
        ";
    }

    public function sendEmail($to,$subject,$body){
        
        $from = env('MAIL_FROM_ADDRESS');
        
        $content = $this->buildEmail($subject,$body);

        $headers = 
            "From: <$from>\r\n".
            "Reply-To: <$from>\r\n".
            "X-Mailer: PHP/".phpversion()."\r\n".
            "MIME-Version: 1.0\r\n".
            "Content-type:text/html;charset=UTF-8";

        try{
            mail($to,$subject,$content,$headers);
            return true;
        }catch(Exception $e){
            return false;
        }

    }

    private function buildSignature(){
        return "
            <table width=\"500\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border:1px solid #ddd; background:#FFF; font-family:Arial, sans-serif; color:#000 !important;\">
                <tr>
                    <td colspan=\"2\" height=\"40\" style=\"line-height: 20px; font-size: 0;\">&nbsp;</td>
                </tr>
                <tr>
                    <td width=\"120\" align=\"center\" style=\"padding: 0 30px;\">
                        <img src=\"https://sindibr.com.br/favicon.png\" alt=\"Logo\" width=\"80\" height=\"80\" style=\"display: block;\" />
                    </td>
        
                    <td>
                        <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\">
                            <tr>
                                <td width=\"2\" align=\"center\" valign=\"middle\" style=\"background: #000;\"></td>
        
                                <td style=\"padding: 0 25px;\">
                                    <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\">
                                        <tr>
                                            <td style=\"font-size: 26px; font-weight: bold; letter-spacing: 3px; color:#000;\">sindi</td>
                                        </tr>
                                        <tr>
                                            <td style=\"font-size: 14px; color: #555 !important; padding-bottom: 15px;\">
                                                conectando síndicos, transformando condomínios
                                            </td>
                                        </tr>
        
                                        <tr>
                                            <td style=\"font-size: 14px; pad4ing-top: 5px;\">
                                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">
                                                    <tr>
                                                        <td width=\"30\" align=\"center\" valign=\"middle\" style=\"font-size:16px;\">📧</td>
                                                        <td style=\"padding-left: 8px; text-decoration:none;\">
                                                            <span style=\" text-decoration:none; color:#000;\">suporte@sindibr.com.br</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
        
                                        <tr>
                                            <td style=\"font-size: 14px; padding-top: 5px;\">
                                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">
                                                    <tr>
                                                        <td width=\"30\" align=\"center\" valign=\"middle\" style=\"font-size:16px;\">📍</td>
                                                        <td style=\"padding-left: 8px; text-decoration:none; color:#000;\">Rio de Janeiro, Brasil</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
        
                                        <tr>
                                            <td style=\"font-size: 14px; padding-top: 5px;\">
                                                <table cellpadding=\"0\" cellspacing=\"0\" border=\"0\">
                                                    <tr>
                                                        <td width=\"30\" align=\"center\" valign=\"middle\" style=\"font-size:16px;\">🌐</td>
                                                        <td style=\"padding-left: 8px;\">
                                                            <span style=\" text-decoration:none; color:#000;\">sindibr.com.br</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan=\"2\" height=\"40\" style=\"line-height: 20px; font-size: 0;\">&nbsp;</td>
                </tr>
            </table>
        ";
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
