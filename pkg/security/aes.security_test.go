package security

import (
	"testing"
)

// Test AES Encryption & Decryption
func TestAESEncryptionDecryption(t *testing.T) {
	key, err := GenerateAESKey()
	if err != nil {
		t.Fatalf("Failed to generate AES key: %v", err)
	}

	plaintext := "Hello, Secure World!"
	encrypted, err := EncryptAES(plaintext, key)
	if err != nil {
		t.Fatalf("AES Encryption failed: %v", err)
	}

	decrypted, err := DecryptAES(encrypted, key)
	if err != nil {
		t.Fatalf("AES Decryption failed: %v", err)
	}

	if decrypted != plaintext {
		t.Errorf("Expected decrypted text to be '%s', got '%s'", plaintext, decrypted)
	}
}

// Test AES Decryption with Wrong Key
func TestAESDecryptionWithWrongKey(t *testing.T) {
	key1, _ := GenerateAESKey()
	key2, _ := GenerateAESKey()

	plaintext := "Mismatch Key Test"
	encrypted, _ := EncryptAES(plaintext, key1)

	_, err := DecryptAES(encrypted, key2)
	if err == nil {
		t.Errorf("Decryption should fail with the wrong key")
	}
}

// Test AES Encryption with an Invalid Key (shorter than required)
func TestAESEncryptionWithInvalidKey(t *testing.T) {
	invalidKey := "shortkey"
	plaintext := "Invalid Key Test"

	_, err := EncryptAES(plaintext, invalidKey)
	if err == nil {
		t.Errorf("Encryption should fail with an invalid key")
	}
}
