package security

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"os"
)

// GenerateRSAKeys creates a new RSA key pair and saves them
func GenerateRSAKeys(bits int, privPath, pubPath string) error {
	privateKey, err := rsa.GenerateKey(rand.Reader, bits)
	if err != nil {
		return err
	}

	privFile, err := os.Create(privPath)
	if err != nil {
		return err
	}
	defer privFile.Close()

	privBytes := x509.MarshalPKCS1PrivateKey(privateKey)
	pem.Encode(privFile, &pem.Block{Type: "RSA PRIVATE KEY", Bytes: privBytes})

	pubFile, err := os.Create(pubPath)
	if err != nil {
		return err
	}
	defer pubFile.Close()

	pubBytes, err := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
	if err != nil {
		return err
	}
	pem.Encode(pubFile, &pem.Block{Type: "PUBLIC KEY", Bytes: pubBytes})

	return nil
}

// EncryptRSA encrypts text using an RSA public key
func EncryptRSA(plaintext, pubKeyPath string) (string, error) {
	pubPEM, err := os.ReadFile(pubKeyPath)
	if err != nil {
		return "", err
	}

	block, _ := pem.Decode(pubPEM)
	pubInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return "", err
	}

	pub := pubInterface.(*rsa.PublicKey)
	ciphertext, err := rsa.EncryptPKCS1v15(rand.Reader, pub, []byte(plaintext))
	if err != nil {
		return "", err
	}

	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// DecryptRSA decrypts text using an RSA private key
func DecryptRSA(cipherText, privKeyPath string) (string, error) {
	privPEM, err := os.ReadFile(privKeyPath)
	if err != nil {
		return "", err
	}

	block, _ := pem.Decode(privPEM)
	priv, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return "", err
	}

	data, err := base64.StdEncoding.DecodeString(cipherText)
	if err != nil {
		return "", err
	}

	plaintext, err := rsa.DecryptPKCS1v15(rand.Reader, priv, data)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}
