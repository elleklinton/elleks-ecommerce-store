
const applepayContainer = 'applepay_container'
const storeName = "Ellek's Store (Card is NOT charged)"

let product
let loadScript

function validate() {
    console.log(888, product)
    if (!window.ApplePaySession) {
        console.error('This device does not support Apple Pay');
        return false;
    } else if (!window.ApplePaySession.canMakePayments()) {
        console.error('This device is not capable of making Apple Pay payments');
        return false;
    } else if (!window.paypal) {
        console.error('window.paypal is null!')
        return false
    }
    return true
}

function validateMerchant(event, session) {
    console.log('validating merchant')
    window.paypal.Applepay().validateMerchant({
        validationUrl: event.validationURL,
        displayName: storeName,

    })
        .then(validateResult => {
            session.completeMerchantValidation(validateResult.merchantSession);
            console.log('merchant successfully validated')
        })
        .catch(validateError => {
            console.error(validateError);
            session.abort();
        });
}

function authorizePayment(event, session) {
    console.log('payment authorized')
    console.log('Your billing address is:', event.payment.billingContact);
    console.log('Your shipping address is:', event.payment.shippingContact);

    console.log("marking payment as complete after 0.5 seconds NOT CALLING ANY APIS")
    setTimeout(() => {
        console.log("marking payment as complete")
        session.completePayment(window.ApplePaySession.STATUS_SUCCESS)
    }, 500)
}

const getProductPrice = () => product.price
const getShipping = () => 5
const getTaxTotal = () => getProductPrice() * 0.085

function getSession(config) {
    const paymentRequest = {
        countryCode: config.countryCode,
        merchantCapabilities: config.merchantCapabilities,
        supportedNetworks: config.supportedNetworks,
        currencyCode: "USD",
        requiredShippingContactFields: ["name", "phone", "email", "postalAddress"],
        requiredBillingContactFields: ["name", "phone", "email", "postalAddress"],
        lineItems: [
            {
                "label": product.title,
                "type": "final",
                "amount": getProductPrice()
            },
            {
                "label": "Tax",
                "type": "final",
                "amount": getTaxTotal()
            },
            {
                "label": "Shipping",
                "type": "final",
                "amount": getShipping()
            }
        ],
        total: {
            label: storeName,
            type: "final",
            amount: getProductPrice() + getTaxTotal() + getShipping(),
        }
    };

    const isSandbox = window?.location.href.toLowerCase().includes('sandbox') ?? false
    loadScript({
        "client-id": isSandbox ? clientIds.sandbox : clientIds.production,
        "merchant-id": isSandbox ? clientIds.sandbox : clientIds.production
    })
        .then(paypal => {
            window.paypal = paypal
            const session = new ApplePaySession(4, paymentRequest);

            session.onvalidatemerchant = (event) => validateMerchant(event, session)
            session.onpaymentauthorized = (event) => authorizePayment(event, session)

            return session
        })

}

function onClick(config) {
    console.log('apple pay button clicked')
    const session = getSession(config)
    session.begin()
}

function renderButton(config) {
    if (config.isEligible) {
        document.getElementById(applepayContainer).innerHTML = '<apple-pay-button id="apple-pay-button" buttonstyle="black" type="buy" locale="en"></apple-pay-button>'
        document.getElementById("apple-pay-button").onclick = () => onClick(config)
    }
}

console.log('Scripts loaded!')
if (validate()) {
    console.log('Apple pay is eligible')
    const applepay = window.paypal.Applepay();
    applepay.config()
        .then(config => {
            renderButton(config)
        })
        .catch(err => {
            console.error('Error while fetching apple pay configuration', err)
        })
}
// From here, render apple pay button
