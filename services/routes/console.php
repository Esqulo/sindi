<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use App\Http\Controllers\PurchasesController;
use App\Http\Controllers\MailSender;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('test:send_email', function () {

    $mailSender = new MailSender;
    $mailSender->sendEmail('juan.elias.cunha@gmail.com','Email Teste', 'Email Teste');

})->purpose('send payment links to purchases of 30 days or older that haven`t been paid.');

Artisan::command('process:payment_links', function () {

    $unpaidPurchasesQuery =
     "SELECT 
        p.id as purchase_id ,
        DATEDIFF(now(),p.purchase_date) as 'datediff',
        (select SUM(current_unit_price) from orders o where o.purchase_id = p.id) as purchase_total,
        (select COALESCE(SUM(amount), 0)  from payments pmts where pmts.purchase_id = p.id ) as paid_total
     FROM purchases p
     HAVING datediff >= 30 and purchase_total > paid_total;
    ";

    $unpaidPurchases = DB::select($unpaidPurchasesQuery);

    $purchasesController = new PurchasesController;
    $mailSender = new MailSender;

    foreach($unpaidPurchases as $purchase){
        try{
            $paymentData = $purchasesController->generatePayment($purchase->purchase_id);
            $mailSender->sendPaymentEmail($paymentData);
        }catch(Exception $e){
            //log error
        }
    }

})->purpose('send payment links to purchases of 30 days or older that haven`t been paid.');