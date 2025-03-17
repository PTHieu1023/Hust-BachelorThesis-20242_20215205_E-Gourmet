package keycloak

import (
	"github.com/Nerzal/gocloak/v13"
	"sync"
	"time"
)

type AdminToken struct {
	sync.Mutex
	IssuedAt time.Time
	*gocloak.JWT
}

func (adm *AdminToken) isExpired() bool {
	return adm.IssuedAt.Add(time.Duration(adm.ExpiresIn) * time.Second).Before(time.Now())
}

func (adm *AdminToken) isRefreshExpired() bool {
	return adm.IssuedAt.Add(time.Duration(adm.RefreshExpiresIn) * time.Second).Before(time.Now())
}
