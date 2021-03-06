package middleware

import "fmt"

//ErrorResponse is a dto for sending error response
type ErrorResponse struct {
	Message string `json:"message"`
	//Deprecated
	Error string `json:"error"`
}

//ErrResponse is a constructor for ErrorResponse
func ErrResponse(msg string, err error) *ErrorResponse {
	if err == nil {
		return &ErrorResponse{Message: msg}
	}

	return &ErrorResponse{
		Message: fmt.Sprintf("%s: %s", msg, err.Error()),
	}
}

//StatusResponse is a dto for sending operation status
type StatusResponse struct {
	Status string `json:"status"`
}

//OKResponse returns StatusResponse with Status = "ok"
func OKResponse() StatusResponse {
	return StatusResponse{Status: "ok"}
}
