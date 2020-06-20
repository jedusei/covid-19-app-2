const SIGNALC_API_URL = "https://signalc.herokuapp.com/graphql";
const COVID19_API_URL = "https://covid19-graphql.netlify.app/";

export function sendCode(phoneNumber) {
    return fetch(SIGNALC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                mutation sendCode($input: loginUserInput) {
                    loginUser(input: $input) {
                        success
                        message
                    }
                }
            `,
            variables: {
                input: { phone: phoneNumber }
            }
        })
    })
        .then(response => response.json())
        .then(response => {
            if (!response.data || !response.data.loginUser || response.data.loginUser.success !== true) {
                console.error(response);
                throw new Error("GRAPHQL_ERROR");
            }
        });
}

export function verifyCode(phoneNumber, code) {
    return fetch(SIGNALC_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                mutation verifyCode($input: validateLoginUserInput) {
                    validateLoginUser(input: $input) {
                        mobileToken 
                        user {
                            age
                            gender
                            lastCountriesVisited
                            licenseNumber
                        }
                    }
                }
            `,
            variables: {
                input: {
                    phone: phoneNumber,
                    otp: code
                }
            }
        })
    })
        .then(response => response.json())
        .then(response => {
            if (response.data)
                return response.data.validateLoginUser;
            else
                return null;
        });
}

export function getGhanaStats() {
    return fetch(COVID19_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `{
                    country(name:"Ghana") {  
                        result { 
                            cases 
                            recovered 
                            deaths 
                            updated
                        }
                    }
                }`
        })
    })
        .then(r => r.json())
        .then(response => response.data.country.result);
}