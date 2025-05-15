package kc

import (
	"context"
	"github.com/Nerzal/gocloak/v13"
	"github.com/golang-jwt/jwt/v5"
)

func (kc *Keycloak) DecodeAccessToken(ctx context.Context, accessToken string) (token *jwt.Token, claims *jwt.MapClaims, err error) {
	return kc.client.DecodeAccessToken(ctx, accessToken, kc.config.Realm)
}

func (kc *Keycloak) RetrospectToken(ctx context.Context, accessToken string) (introspectResult *gocloak.IntroSpectTokenResult, err error) {
	return kc.client.RetrospectToken(ctx, accessToken, kc.config.ClientID, kc.config.ClientSecret, kc.config.Realm)
}

func (kc *Keycloak) SetPassword(ctx context.Context, userID string, password string, temporary bool) error {
	token, err := kc.GetSession(ctx)
	if err != nil {
		return err
	}
	return kc.client.SetPassword(ctx, token, userID, kc.config.Realm, password, temporary)
}

func (kc *Keycloak) CreateUser(ctx context.Context, user *gocloak.User) (string, error) {
	token, err := kc.GetSession(ctx)
	if err != nil {
		return "", err
	}
	return kc.client.CreateUser(ctx, token, kc.config.Realm, *user)
}

func (kc *Keycloak) UpdateUser(ctx context.Context, user *gocloak.User) error {
	token, err := kc.GetSession(ctx)
	if err != nil {
		return err
	}
	return kc.client.UpdateUser(ctx, token, kc.config.Realm, *user)
}

func (kc *Keycloak) DeleteUser(ctx context.Context, userID string) error {
	token, err := kc.GetSession(ctx)
	if err != nil {
		return err
	}
	return kc.client.DeleteUser(ctx, token, kc.config.Realm, userID)
}

func (kc *Keycloak) GetUserByID(ctx context.Context, userID string) (*gocloak.User, error) {
	token, err := kc.GetSession(ctx)
	if err != nil {
		return nil, err
	}
	return kc.client.GetUserByID(ctx, token, kc.config.Realm, userID)
}
