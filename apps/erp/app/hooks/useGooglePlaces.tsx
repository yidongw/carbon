import { GOOGLE_PLACES_API_KEY } from "@carbon/auth";
import { useLingui } from "@lingui/react/macro";
import { nanoid } from "nanoid";
import { useCallback, useRef, useState } from "react";

// Google Places (places.googleapis.com) is unreachable in some regions (e.g.
// blocked by the GFW in mainland China). Without a timeout every keystroke hangs
// for ~10s; once we detect it's unreachable we stop trying for the rest of the
// session so the address field silently degrades to a plain text input.
const PLACES_TIMEOUT_MS = 4000;
let placesUnavailable = false;

async function fetchWithTimeout(url: string, options?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PLACES_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// A thrown AbortError (timeout) or TypeError (network/blocked) means we couldn't
// reach Google at all — as opposed to a real API error (bad key, 4xx response).
function isConnectivityError(err: unknown): boolean {
  return (
    (err instanceof DOMException && err.name === "AbortError") ||
    err instanceof TypeError
  );
}

interface PlaceSuggestion {
  placeId: string;
  text: string;
}

interface AddressComponents {
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
}

interface GooglePlacesApiResponse {
  suggestions?: Array<{
    placePrediction?: {
      place: string;
      placeId: string;
      text: {
        text: string;
      };
    };
  }>;
}

interface PlaceDetailsResponse {
  addressComponents?: Array<{
    longText: string;
    shortText: string;
    types: string[];
  }>;
}

export const useGooglePlaces = () => {
  const { t } = useLingui();
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionTokenRef = useRef<string>("");

  const getSuggestions = useCallback(
    async (input: string) => {
      if (!GOOGLE_PLACES_API_KEY || placesUnavailable) {
        // Silently degrade to a plain text field — no error, no hang.
        setSuggestions([]);
        return;
      }

      if (!input) {
        setSuggestions([]);
        setError(null);
        return;
      }

      // Generate session token on first autocomplete request
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = nanoid();
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetchWithTimeout(
          "https://places.googleapis.com/v1/places:autocomplete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY
            },
            body: JSON.stringify({
              input,
              includedPrimaryTypes: ["street_address"],
              languageCode: "en",
              sessionToken: sessionTokenRef.current
            })
          }
        );

        if (!response.ok) {
          throw new Error(`Google Places API error: ${response.status}`);
        }

        const data: GooglePlacesApiResponse = await response.json();

        const placeSuggestions: PlaceSuggestion[] = (data.suggestions || [])
          .map((suggestion) => {
            const prediction = suggestion.placePrediction;
            if (!prediction) return null;

            return {
              placeId: prediction.placeId,
              text: prediction.text.text
            };
          })
          .filter(
            (suggestion): suggestion is PlaceSuggestion => suggestion !== null
          );

        setSuggestions(placeSuggestions);
      } catch (err) {
        setSuggestions([]);
        if (isConnectivityError(err)) {
          // Blocked/unreachable region — stop trying for the rest of the session.
          placesUnavailable = true;
          setError(null);
        } else {
          console.error("Google Places API error:", err);
          setError(
            err instanceof Error ? err.message : t`Failed to fetch suggestions`
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  const parseAddressComponents = (
    components: Array<{
      longText: string;
      shortText: string;
      types: string[];
    }>
  ): AddressComponents => {
    if (!components) {
      return {
        addressLine1: "",
        addressLine2: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        countryCode: ""
      };
    }

    const addressMap: Record<string, string> = {};

    components.forEach((component) => {
      const types = component.types;

      if (types.includes("street_number")) {
        addressMap.streetNumber = component.longText;
      }
      if (types.includes("route")) {
        addressMap.route = component.longText;
      }
      if (types.includes("subpremise")) {
        addressMap.subpremise = component.longText;
      }
      if (types.includes("locality")) {
        addressMap.city = component.longText;
      }
      if (types.includes("sublocality")) {
        addressMap.sublocality = component.longText;
      }
      if (types.includes("administrative_area_level_1")) {
        addressMap.stateProvince = component.shortText;
      }
      if (types.includes("postal_code")) {
        addressMap.postalCode = component.longText;
      }
      if (types.includes("country")) {
        addressMap.countryCode = component.shortText;
      }
    });

    return {
      addressLine1: `${addressMap.streetNumber || ""} ${
        addressMap.route || ""
      }`.trim(),
      addressLine2: addressMap.subpremise || "",
      city: addressMap.city || addressMap.sublocality || "",
      stateProvince: addressMap.stateProvince || "",
      postalCode: addressMap.postalCode || "",
      countryCode: addressMap.countryCode || ""
    };
  };

  const getPlaceDetails = async (
    placeId: string
  ): Promise<AddressComponents | null> => {
    if (!GOOGLE_PLACES_API_KEY || placesUnavailable) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithTimeout(
        `https://places.googleapis.com/v1/places/${placeId}?sessionToken=${sessionTokenRef.current}`,
        {
          headers: {
            "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
            "X-Goog-FieldMask": "addressComponents"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
      }

      const data: PlaceDetailsResponse = await response.json();

      if (!data.addressComponents) {
        throw new Error("No address components found");
      }

      return parseAddressComponents(data.addressComponents);
    } catch (err) {
      if (isConnectivityError(err)) {
        placesUnavailable = true;
        setError(null);
      } else {
        console.error("Google Places API error:", err);
        setError(
          err instanceof Error ? err.message : t`Failed to fetch place details`
        );
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  const selectPlace = useCallback(
    async (placeId: string): Promise<AddressComponents | null> => {
      const addressComponents = await getPlaceDetails(placeId);
      setSuggestions([]);

      // Generate a new session token for the next autocomplete session
      sessionTokenRef.current = nanoid();

      return addressComponents;
    },

    []
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    loading,
    error,
    getSuggestions,
    selectPlace,
    clearSuggestions
  };
};
