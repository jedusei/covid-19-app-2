const GRAPHQL_ENDPOINT = "http://signalc.herokuapp.com/graphql";

export function sendCode(phoneNumber) {
    return fetch(GRAPHQL_ENDPOINT, {
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
    return fetch(GRAPHQL_ENDPOINT, {
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