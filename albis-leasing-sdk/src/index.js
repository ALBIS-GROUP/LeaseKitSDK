import axios from 'axios';
import _ from 'lodash';
import { getEndpointPath, getToken } from './helpers';
import { mapPaymentOption } from './helpers';

// run:
// jsdoc -d ./public/doc/ src/utils/albis.js to create a documentation for this file
// OR if .md file needed
// jsdoc2md path/to/JSfile.js  > yourFile.md

/**
 * An Albis class
 */

class Albis {
  /**
   * Create an Albis object
   * Note: due to security reasons, keep all sensitive data (i.e. APIid, APIsecret, username, ...)
   * @param {Object} settings
   * @param {string=} settings.APIid - API id used for retrieving a valid a token
   * @param {string=} settings.APIsecret - API secret used for retrieving a valid token
   * @param {string=} settings.username - shop owner or shop admins username
   * @param {string=} settings.password - shop owner or shop admin password
   * @param {string=} settings.realm - shop owner connection name
   * @param {number=} settings.provision - provision - defines how much commission, retailer wants to receives for each deal. Possible values min: 0, max: 5. Default 0.
   * @param {string=} settings.auth0Endpoint - Auth0 endpoint - needed to create a token usable in Albis methods
   * @param {string=} settings.SDKendpoint - SDK endpoint
   * @param {string=} settings.audience - Auth0 audience - needed to create a token usable in Albis methods
   * @param {string=} settings.grantType - Auth0 grantType - needed to create a token usable in Albis methods
   * @param {boolean=} settings.apiStage - defines proper API Gateway endpoints stage (API version) for requests 
   * @param {string=} settings.nodeEnv - defines the environment (development, production, test)
   *
   * @example
   *
   * new Albis(
   *  {
   *    APIid: 'abcde',
   *    APIsecret: 'asdf',
   *    username: 'username',
   *    password: 'password',
   *    realm: 'shop',
   *    provision: 3,
   *    auth0Endpoint: 'https://urlToTokenProvider/token',
   *    SDKendpoint: 'https://sdkEndpoint',
   *    audience:'https://urlToTokenProvider/v2',
   *    grantType: 'https://urlToTokenProvider/password-realm',
   *    apiStage: 'staging',
   *    nodeEnv: 'development'
   *  })
   */

  constructor(settings) {
    this.APIid = settings.APIid;
    this.APIsecret = settings.APIsecret;
    this.username = settings.username;
    this.password = settings.password;
    this.realm = settings.realm;
    this.provision = settings.provision;
    this.auth0Endpoint = settings.auth0Endpoint;
    this.SDKendpoint = settings.SDKendpoint;
    this.audience = settings.audience;
    this.grantType = settings.grantType;
    this.apiStage = settings.apiStage;
    this.nodeEnv = settings.nodeEnv
  }

  /**
   * getAlbisToken() returns albisToken needed to call other Albis functions
   * 
   * @returns {Object} albisToken
   *
   * @example
   * getAlbisToken()
   */

   async getAlbisToken() {
    const albisToken = await getToken(
      this.APIid,
      this.APIsecret,
      this.auth0Endpoint,
      this.username,
      this.password,
      this.realm,
      this.audience,
      this.grantType,
      this.nodeEnv
    );
    return albisToken
   }

  /**
   * ping(albisToken) checks the connection with Albis API and shop credentials
   * 
   * @param {Object} albisToken - object with Albis token, which lets to communicate with Albis API
   *
   * @returns {string} "{result: "pong"}"
   *
   * @example
   * ping({token: '1234'})
   */

  async ping(albisToken) {
    const endpoint = getEndpointPath('ping', this.apiStage, this.SDKendpoint, this.nodeEnv);
    return axios.get(endpoint, {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${albisToken.token}`,
      },
    });
  }

  /**
   * getRates(values, albisToken) retrieves proposed rates. Returned object is needed for proceed getApplication(albisToken)
   *
   * @param {Object} values - An object with data for providing rate offers
   * @param {number} values.purchasePrice - Total net value of the cart [EUR]
   * @param {number} values.productGroup - Product group of chosen products FOR NOW constant 1    ~~~~~
   * @param {number=} values.downPayment - Net value of down payment [EUR]. Default 0
   * @param {number} values.contractType - Contract type FOR NOW contant 1                        ~~~~~
   * @param {string} values.paymentMethod - Payment options - possible values: 'quarterly' or 'monthly'
   * @param {Object} albisToken - object with Albis token, which lets to communicate with Albis API
   *
   * @returns {Object} An Object with attributes passed to the function and additional attributes:
   * leaseTerm,
   * value,
   * insurance
   * finalPayment (if there is an opportunity to shrotening the lease term)
   *
   * @example
   *
   * getRates({ purchasePrice: 5000, productGroup: 1, downPayment: 500, contractType: 1, paymentMethod: 'quarterly'}, , { token: '12345' })
   */

  async getRates(values, albisToken) {
    let rates = {};
    const endpoint = getEndpointPath('rate', this.apiStage, this.SDKendpoint, this.nodeEnv);

    values = {...values, paymentMethod: mapPaymentOption(values.paymentMethod)}
    rates = axios.get(endpoint, {
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${albisToken.token}`,
      },
      params: {
        ...values,
        provision: this.provision,
      },
    });

    return rates;
  }

  /**
   * saveApplication(values, albisToken) saves an application
   *
   * @param {Object} values - An object with values data
   * @param {string} values.object - Name of the object (80 char max)
   * @param {number} values.purchasePrice - purchase price (object value)
   * @param {number} values.downPayment - down payment
   * @param {number} values.leasePayments - lease payments (returned from getRates() method)
   * @param {number} values.leaseTerm - lease term (returned from getRates() method)
   * @param {number} values.leasePaymentsWithInsurance - lease payments with insurance (returned from getRates() method)
   * @param {number} values.finalPayment - final payment (returned from getRates() method)
   * @param {Object} values.lessee
   * @param {string} values.lessee.name - lessee name
   * @param {string} values.lessee.street - lessee street
   * @param {number} values.lessee.zipCode - lessee zip code
   * @param {string} values.lessee.city - lessee city
   * @param {string} values.lessee.phoneNumber - lessee phone number
   * @param {string} values.lessee.email - lessee email
   * @param {string} values.lessee.legalForm - lessee legal form
   * @param {number} values.provision - shop provision
   * @param {string} values.productGroup - product group
   * @param {string} values.contractType - contract type
   * @param {string} values.paymentMethod - payment method ('monthly' or 'quarterly')
   * @param {string} values.iban - iban
   * @param {boolean} values.ssv - insurance value
   * @param {number} values.serviceFee - service fee
   * @param {boolean} values.contractByEmail - is contact by email required
   * @param {Object} albisToken - object with Albis token, which lets to communicate with Albis API
   *
   * @returns {number} a unique number of the application
   *
   * @example
   *
   * saveApplication(
   *  {
   *    object: 'Fridge VW',
   *    purchasePrice: 5000,
   *    downPayment: null,
   *    leasePayments: 300,
   *    leaseTerm: 12,
   *    leasePaymentsWithInsurance: 23,
   *    finalPayment: 150,
   *    lessee: {
   *      name: 'Antonina',
   *      street: 'Lichtenrade',
   *      city: 'Berlin',
   *      zipCode: 50000,
   *      phoneNumber: '+48500000000',
   *      faxNumber: '+48500000000'
   *      email: 'abc@gmail.com',
   *      legalForm: 'GmbH'
   *    },
   *    provision: 3,
   *    productGroup: 1,
   *    contractType: 1,
   *    paymentMethod: 'quarterly',
   *    iban: 'DE88100900001234567892',
   *    ssv: true,
   *    serviceFee: 300,
   *    contractByEmail: true
   * },
   * {token: '12345'})
   */

  async saveApplication(values, albisToken) {
    const endpoint = getEndpointPath('application', this.apiStage, this.SDKendpoint, this.nodeEnv);

    //mapping payment options
    values = {...values, paymentMethod: mapPaymentOption(values.paymentMethod)}

    //mapping legalForms (from string to number)
    values = {
      ...values,
      lessee: {
        ...values.lessee,
        legalForm: await this.mapLegalForm(values.lessee.legalForm, albisToken),
      },
    };

    if (values.object.length > 80) {
      values = {...values, object: values.object.substring(0,77) + "..." }
    }
    return axios.post(endpoint,
      {
        params: {
        application: JSON.stringify({...values, provision: this.provision}),
      }
    }, 
      {
        headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${albisToken.token}`,
       }
    })
  }

    /**
   * getLegalForms() get a map of all legal forms (needed for lessee data)
   * 
   * @param {Object} albisToken - object with Albis token, which lets to communicate with Albis API
   *
   * @returns {Object} An object with legal forms and their respective IDs
   *
   * @example
   * getLegalForms({token: '12345'})
   */

  async getLegalForms(albisToken) {
    const endpoint = getEndpointPath('legal-forms', this.apiStage, this.SDKendpoint, this.nodeEnv);

    const legalForms = await axios.get(endpoint, {
      headers: { 
        'content-type': 'application/json',
        'Authorization': `Bearer ${albisToken.token}`,
      },
    });

    return legalForms.data;
  }

  async mapLegalForm(name, albisToken) {
    const list = await(this.getLegalForms(albisToken));
    let result = list.find(lf => lf.text === name);
    return result.id || 99;
  }
}

export default Albis;