package services

type Cuisine struct {
	ID       int16              `json:"id"`
	Name     string             `json:"name"`
	ImageUrl *string            `json:"imageUrl,omitempty"`
	ParentId *int16             `json:"parentId,omitempty"`
	Children map[int16]*Cuisine `json:"children,omitempty"`
}

func NewCuisine(id int16, name string, parentId *int16, imageUrl *string) *Cuisine {
	return &Cuisine{
		ID:       id,
		Name:     name,
		ParentId: parentId,
		ImageUrl: imageUrl,
	}
}
