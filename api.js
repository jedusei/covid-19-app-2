const SIGNALC_API_URL = "https://signalc.herokuapp.com/graphql";
const COVID19_API_URL = "https://covid19-graphql.netlify.app/";

function graphQL(API_URL, query, variables) {
    return fetch(
        API_URL,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        }
    ).then(res => res.json());
}

export function sendCode(phoneNumber) {
    phoneNumber = "0558691496";
    return graphQL(
        SIGNALC_API_URL,
        `mutation sendCode($input: loginUserInput) {
            loginUser(input: $input) {
                success
                message
            }
        }`,
        { input: { phone: phoneNumber } }
    ).then(response => {
        if (!response.data || !response.data.loginUser || response.data.loginUser.success !== true) {
            console.error(response);
            throw new Error("GRAPHQL_ERROR");
        }
    });
}

export function verifyCode(phoneNumber, code) {
    phoneNumber = "0558691496";
    return graphQL(
        SIGNALC_API_URL,
        `mutation verifyCode($input: validateLoginUserInput) {
            validateLoginUser(input: $input) {
                mobileToken 
                user {
                    age
                    gender
                    lastCountriesVisited 
                    licenseNumber 
                }
            }
        }`,
        { input: { phone: phoneNumber, otp: code } }
    ).then(response => {
        if (response.data)
            return response.data.validateLoginUser;
        else
            return null;
    });
}

export function getNotifications() {
    return graphQL(
        SIGNALC_API_URL,
        `{
            broadcastMessages {
              title
              description
              date: createdAt
            }
        }`,
    ).then(response => response.data.broadcastMessages);
}

export function getReports() {
    return graphQL(
        SIGNALC_API_URL,
        `{
            reportedCases {
              target: reporting
              location
              date: createdAt
              landmark: nearestLandmark
              description
              user {
                phone
              }
            }
        }`,
    ).then(response => response.data.reportedCases.filter(c => c.user.phone === "0558691496"));
}

export function getVitals() {
    return graphQL(
        SIGNALC_API_URL,
        `{
            vitals {
              user {
                phone
              }
              symptoms: vitals {
                dryCough
                tiredness
                soreThroat
                fever
                aches
                shortnessOfBreath
              }
              date: createdAt
            }
        }`,
    ).then(response => response.data.vitals.filter(v => v.user.phone === "0558691496"));
}

export function getCountries() {
    return graphQL(
        COVID19_API_URL,
        `{
            countries {
                country
                countryInfo {
                    flag
                }
            }
        }`
    ).then(response => response.data.countries.map(c => {
        return {
            name: c.country,
            flag: c.countryInfo.flag
        };
    }));
}

export function getWorldStats() {
    return graphQL(
        COVID19_API_URL,
        `{
            globalTotal {
                confirmed: cases
                recovered
                deaths
            }
        }`
    ).then(response => response.data.globalTotal);
}

export function getCountryStats(country) {
    return graphQL(
        COVID19_API_URL,
        `{
            country(name: "${country}") {
                result {
                    confirmed: cases
                    tests
                    deaths
                    active
                    recovered
                    critical
                    updated
                }
            }
        }`
    ).then(response => response.data.country.result);
}

export function getTestingCentres() {
    return graphQL(
        SIGNALC_API_URL,
        `{
            testingSites {
              name
              address
              placesName
              location {coordinates}
            }
        }`
    ).then(response => response.data.testingSites);
}