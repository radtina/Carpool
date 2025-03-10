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

// GetDuration returns the duration (in minutes) for a trip.
func GetDuration(fromLon, fromLat, toLon, toLat float64) (int, error) {
    apiKey := os.Getenv("ORS_API_KEY")
    if apiKey == "" {
        return 0, fmt.Errorf("ORS_API_KEY not set")
    }

    client := resty.New()
    client.SetTimeout(10 * time.Second)

    url := fmt.Sprintf("https://api.openrouteservice.org/v2/directions/driving-car?api_key=%s&start=%f,%f&end=%f,%f",
        apiKey, fromLon, fromLat, toLon, toLat)

    resp, err := client.R().Get(url)
    if err != nil {
        return 0, err
    }

    var orsResp ORSResponse
    if err := json.Unmarshal(resp.Body(), &orsResp); err != nil {
        return 0, err
    }

    if len(orsResp.Features) == 0 || len(orsResp.Features[0].Properties.Segments) == 0 {
        return 0, fmt.Errorf("no route found")
    }

    durationSeconds := orsResp.Features[0].Properties.Segments[0].Duration
    minutes := int(durationSeconds / 60)
    return minutes, nil
}

