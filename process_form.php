<?php

// Inclure les fichiers PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';
require 'PHPMailer-master/src/Exception.php';

// Vérifiez que la méthode est bien POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Récupérer et sécuriser les données du formulaire
    $firstname = htmlspecialchars($_POST['firstname']);
    $lastname = htmlspecialchars($_POST['lastname']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $telephone = htmlspecialchars($_POST['telephone']);
    $address = htmlspecialchars($_POST['address']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    // Valider l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Adresse e-mail non valide.";
        error_log("Adresse e-mail non valide: $email");
        exit;
    }

    // Instancier PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Paramètres du serveur SMTP
        $mail->isSMTP();
        $mail->Host = 't-box-international.com'; // Serveur SMTP de GoDaddy
        $mail->SMTPAuth = true;
        $mail->Username = 'michel@t-box-international.com'; // Remplacez par votre adresse email GoDaddy
        $mail->Password = 'E[D*yP-LFc8+'; // Remplacez par le mot de passe de votre email
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Utiliser SSL
        $mail->Port = 465; // Port SSL

        // Destinataires
        $mail->setFrom('michel@t-box-international.com', 'T-Box International');
        $mail->addAddress('michel@t-box-international.com'); // Adresse de destination
        $mail->addAddress('andre@t-box-international.com');
        $mail->addAddress('raphael@t-box-international.com');
        $mail->addAddress('yoel@t-box-international.com');

        // Contenu de l'email
        $mail->isHTML(true); // Permet d'envoyer l'email au format HTML
        $mail->Subject = "Nouveau message : $subject";
        
        // Construire le corps du message
        $mail->isHTML(true); // Set email format to HTML
        $mail->CharSet = 'UTF-8'; // Ensure proper character encoding for special characters
        $mail->Body = "
        <h3>Nouveau message de T-Box International</h3>
        <p><strong>Prénom:</strong> $firstname</p>
        <p><strong>Nom:</strong> $lastname</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Téléphone:</strong> $telephone</p>
        <p><strong>Adresse:</strong> $address</p>
        <p><strong>Sujet:</strong> $subject</p>
        <p><strong>Message:</strong> $message</p>";

        // Envoi de l'email
        $mail->send();
        echo '<script language="javascript">';
        echo 'alert("Votre message a été envoyé avec succès ! Nous vous contacterons prochainement.");';
        echo 'window.location.href = "index.html";'; // Redirection après succès
        echo '</script>';
    } catch (Exception $e) {
        echo "Message non envoyé. Erreur de PHPMailer : {$mail->ErrorInfo}";
        error_log("Erreur de PHPMailer : {$mail->ErrorInfo}");
    }

} else {
    // Si la méthode n'est pas POST
    echo "Méthode de requête non supportée.";
    error_log("Méthode de requête non supportée: " . $_SERVER["REQUEST_METHOD"]);
}
?>
