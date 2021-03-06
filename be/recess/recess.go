package recess

type Method struct {
	Name   string   `json:"name"`
	Type   string   `json:"type"`
	Fields []*Field `json:"fields,omitempty"`
}

type Service struct {
	Name    string    `json:"serviceName"`
	Methods []*Method `json:"methods"`
}

type Field struct {
	Name       string   `json:"name"`
	IsRepeated bool     `json:"isRepeated"`
	IsRequired bool     `json:"isRequired"`
	Type       string   `json:"type"`
	EnumValues []string `json:"enumValues,omitempty"`
	Children   []*Field `json:"children,omitempty"`
}

// IsCamelCase is used by all requests/responses that convert proto <-> json
var IsCamelCase bool
