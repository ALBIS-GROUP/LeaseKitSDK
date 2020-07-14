(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("axios"), require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["axios", "lodash"], factory);
	else if(typeof exports === 'object')
		exports["albis-leasing-sdk"] = factory(require("axios"), require("lodash"));
	else
		root["albis-leasing-sdk"] = factory(root["axios"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_axios__, __WEBPACK_EXTERNAL_MODULE_lodash__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/*! exports provided: getToken, login, getEndpointPath, mapPaymentOption */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getToken", function() { return getToken; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "login", function() { return login; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEndpointPath", function() { return getEndpointPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapPaymentOption", function() { return mapPaymentOption; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);



async function getToken(
  APIid,
  APIsecret,
  auth0Endpoint,
  username,
  password,
  realm,
  audience,
  grantType,
  nodeEnv
) {
  let LocalStorageToken = "{}"
  if (!(typeof window === 'undefined')) {
    LocalStorageToken = localStorage.getItem('albisToken')
  }
  let albisToken = JSON.parse(LocalStorageToken)
  const date = new Date();
  if (
    (lodash__WEBPACK_IMPORTED_MODULE_1___default.a.isEmpty(albisToken) || albisToken.expires < new Date()) &&
    nodeEnv !== 'test'
  ) {
    let token = {};
    try {
      token = await login(
        APIid,
        APIsecret,
        auth0Endpoint,
        username,
        password,
        realm,
        audience,
        grantType,
        nodeEnv
      );
    } catch (err) {
      return `Error occured during authentication: ${err}`;
    }
    albisToken = {
      token: token.data.access_token,
      scope: token.data.scope,
      token_type: token.data.token_type,
      expires_in_Auth0: token.data.expires_in,
      expires: date.setHours(date.getHours() + token.data.expires_in / 3600),
    };
    if (!(typeof window === 'undefined')) {
      localStorage.setItem('albisToken', JSON.stringify(albisToken));
    }
    return albisToken;
  }

  return albisToken;
}

async function login(
  APIid,
  APIsecret,
  auth0Endpoint,
  username,
  password,
  realm,
  audience,
  grantType,
  nodeEnv
) {
  if (nodeEnv === 'test')
    return Promise.resolve({ data: { access_token: 'testAuth0Token12345' } });
  return axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(auth0Endpoint, {
    headers: { 'content-type': 'application/json' },
    username,
    password,
    realm,
    client_id: APIid,
    client_secret: APIsecret,
    audience,
    grant_type: grantType,
  });
}

function getEndpointPath(resource, apiStage, SDKendpoint, nodeEnv) {
  if (resource === 'rate' && nodeEnv === 'test')
    return `http://localhost:3000/testModels/rates.json`;
  return `${SDKendpoint}/${apiStage}/${resource}`;
}

function mapPaymentOption(paymentOption) {
  const paymentOptions = {
    quarterly: 1,
    monthly: 2
  };
  return paymentOptions[paymentOption];
}


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./src/helpers.js");





// run:
// jsdoc -d ./public/doc/ src/utils/albis.js to create a documentation for this file

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
   * @param {string=} settings.auth0Endpoint
   * @param {string=} settings.SDKendpoint
   * @param {string=} settings.audience
   * @param {string=} settings.grantType
   * @param {boolean} settings.apiStage - defines proper API Gateway enpoints for requests (true - /staging, false - /v1)
   * @param {string} settings.nodeEnv - defines the environment (development, production, test)
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
   *    apiStage: staging,
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
    const albisToken = await Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["getToken"])(
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
    const endpoint = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["getEndpointPath"])('ping', this.apiStage, this.SDKendpoint, this.nodeEnv);
    return axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(endpoint, {
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
    const endpoint = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["getEndpointPath"])('rate', this.apiStage, this.SDKendpoint, this.nodeEnv);

    values = {...values, paymentMethod: Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["mapPaymentOption"])(values.paymentMethod)}
    rates = axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(endpoint, {
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
   * @param {number} values.purchasePrice
   * @param {number} values.downPayment
   * @param {number} values.leasePayments
   * @param {number} values.leaseTerm
   * @param {number} values.leasePaymentsWithInsurance
   * @param {number} values.finalPayment
   * @param {Object} values.lessee
   * @param {string} values.lessee.name
   * @param {string} values.lessee.street
   * @param {number} values.lessee.zipCode
   * @param {string} values.lessee.city
   * @param {string} values.lessee.phoneNumber
   * @param {string} values.lessee.email
   * @param {string} values.lessee.legalForm
   * @param {number} values.provision
   * @param {string} values.productGroup
   * @param {string} values.contractType
   * @param {string} values.paymentMethod
   * @param {string} values.iban
   * @param {boolean} values.ssv
   * @param {number} values.serviceFee
   * @param {boolean} values.contractByEmail
   * @param {Object} albisToken - object with Albis token, which lets to communicate with Albis API
   *
   * @returns "Application has been successufully sent"
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
    const endpoint = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["getEndpointPath"])('application', this.apiStage, this.SDKendpoint, this.nodeEnv);

    //mapping payment options
    values = {...values, paymentMethod: Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["mapPaymentOption"])(values.paymentMethod)}

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
    return axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(endpoint,
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
    const endpoint = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["getEndpointPath"])('legal-forms', this.apiStage, this.SDKendpoint, this.nodeEnv);

    const legalForms = await axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(endpoint, {
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

/* harmony default export */ __webpack_exports__["default"] = (Albis);


/***/ }),

/***/ "axios":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"axios","commonjs2":"axios","amd":"axios","root":"axios"} ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_axios__;

/***/ }),

/***/ "lodash":
/*!*************************************************************************************!*\
  !*** external {"commonjs":"lodash","commonjs2":"lodash","amd":"lodash","root":"_"} ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;

/***/ })

/******/ });
});
//# sourceMappingURL=albis-leasing-sdk.js.map