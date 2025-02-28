package ride

import (
	"encoding/json"
	"fmt"
	"github.com/go-resty/resty/v2"
	"os"
	"time"
)

type ORSResponse struct {
	Features []struct {
		Properties struct {
			Segments []struct {
				Duration float64 `json:"duration"` // in seconds
			} `json:"segments"`
		} `json:"properties"`
	} `json:"features"`
}

func GetETA(fromLon, fromLat, toLon, toLat float64) (string, error) {
	apiKey := os.Getenv("ORS_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("ORS_API_KEY not set")
	}

	client := resty.New()
	client.SetTimeout(10 * time.Second)

	url := fmt.Sprintf("https://api.openrouteservice.org/v2/directions/driving-car?api_key=%s&start=%f,%f&end=%f,%f",
		apiKey, fromLon, fromLat, toLon, toLat)

	resp, err := client.R().Get(url)
	if err != nil {
		return "", err
	}

	var orsResp ORSResponse
	if err := json.Unmarshal(resp.Body(), &orsResp); err != nil {
		return "", err
	}

	if len(orsResp.Features) == 0 || len(orsResp.Features[0].Properties.Segments) == 0 {
		return "", fmt.Errorf("no route found")
	}

	durationSeconds := orsResp.Features[0].Properties.Segments[0].Duration
	minutes := durationSeconds / 60

	return fmt.Sprintf("%.0f mins", minutes), nil
}
