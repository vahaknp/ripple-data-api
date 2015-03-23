var winston = require('winston');
var moment  = require('moment');
var ripple  = require('ripple-lib');
var async   = require('async');
var utils   = require('../utils');

var marketPairs = [
  {
    // Bitstamp USD market
    base: {currency: 'USD', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'},
    counter: {currency: 'XRP'}
  },
  {
    // Bitstamp BTC market
    base: {currency: 'BTC', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'},
    counter: {currency: 'XRP'}
  },
  {
    // RippleCN CNY market
    base: {currency: 'CNY', issuer: 'rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK'},
    counter: {currency: 'XRP'}
  },
  {
    // RippleChina CNY market
    base: {currency: 'CNY', issuer: 'razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA'},
    counter: {currency: 'XRP'}
  },
  {
    // RippleFox CNY market
    base: {currency: 'CNY', issuer: 'rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y'},
    counter: {currency: 'XRP'}
  },
  {
    // SnapSwap USD market
    base: {currency: 'USD', issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'},
    counter: {currency: 'XRP'}
  },
  {
    // SnapSwap USD market
    base: {currency: 'EUR', issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'},
    counter: {currency: 'XRP'}
  },
  {
    // SnapSwap BTC market
    base: {currency:'BTC', issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'},
    counter: {currency:'XRP'}
  },
  {
    // Justcoin BTC market
    base: {currency:'BTC', issuer: 'rJHygWcTLVpSXkowott6kzgZU6viQSVYM1'},
    counter: {currency:'XRP'}
  },
  {
    // Ripple Trade Japan JPY
    base: {currency:'JPY', issuer: 'rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6'},
    counter: {currency:'XRP'}
  },
  {
    // TokyoJPY JPY
    base: {currency:'JPY', issuer: 'r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN'},
    counter: {currency:'XRP'}
  },
  {
    // Ripple Market Japan JPY
    base: {currency:'JPY', issuer: 'rJRi8WW24gt9X85PHAxfWNPCizMMhqUQwg'},
    counter: {currency:'XRP'}
  },
  {
    // Pax Moneta KRW
    base: {currency:'KRW', issuer: 'rUkMKjQitpgAM5WTGk79xpjT38DEJY283d'},
    counter: {currency:'XRP'}
  },
  {
    // Snapswap EUR/ Snapswap USD
    base    : {currency: 'EUR', issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'},
    counter : {currency: 'USD', issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'}
  },
  {
    // Bitstamp BTC/USD
    base    : {currency: 'BTC', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'},
    counter : {currency: 'USD', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'},
  },
  {
    // Bitstamp BTC/USD
    base    : {currency: 'BTC', issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'},
    counter : {currency: 'USD', issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'},
  },
  {
    // Bitstamp BTC/ Snapswap BTC
    base    : {currency: 'BTC', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'},
    counter : {currency: 'BTC', issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'},
  },
  {
    // Bitstamp USD/ Snapswap USD
    base    : {currency: 'USD', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'},
    counter : {currency: 'USD', issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'},
  },
  {
    // Bitstamp USD/ rippleCN CNY
    base    : {currency: 'CNY', issuer: 'rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK'},
    counter : {currency: 'USD', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'}
  },
  {
    // Bitstamp USD/ rippleChina CNY
    base    : {currency: 'CNY', issuer: 'razqQKzJRdB4UxFPWf5NEpEG3WMkmwgcXA'},
    counter : {currency: 'USD', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'}
  },
  {
    //ripple trade japan JPY/ Bitstamp USD
    base    : {currency: 'JPY', issuer: 'rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6'},
    counter : {currency: 'USD', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B'}
  },
  {
    //ripple trade japan JPY/ Snapswap USD/
    base    : {currency: 'JPY', issuer: 'rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6'},
    counter : {currency: 'USD', issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'}
  },
  {
    //ripple trade japan JPY/ RippleCN CNY/
    base    : {currency: 'JPY', issuer: 'rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6'},
    counter : {currency: 'CNY', issuer: 'rnuF96W4SZoCJmbHYBFoJZpR8eCaxNvekK'}
  },
  {
    // Ripple Trade Japan JPY/TokyoJPY JPY
    base    : {currency:'JPY', issuer: 'rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6'},
    counter : {currency:'JPY', issuer: 'r94s8px6kSw1uZ1MV98dhSRTvc6VMPoPcN'}
  }
];

var intervals = [
  'hour',
  'day',
  'week',
  'month'
];

function tradeVolume(params, callback) {

  var rowkey;
  var ex;
  var startTime;
  var endTime;

  if (!params) params = {};
  ex        = params.ex || {currency:'XRP'};
  interval  = (params.interval || '').toLowerCase();
  startTime = params.startTime;

  rowkey    = 'trade_volume';

  if (!startTime) {
    startTime = moment.utc().subtract(24, 'hours');
    endTime   = moment.utc();
    rowkey   += '|live';
    interval  = null;

  } else if (!interval || intervals.indexOf(interval) === -1) {
    callback('invalid interval');
    return;

  } else {
    startTime.startOf(interval);
    rowkey += '|' + interval + '|' + utils.formatTime(startTime);
    endTime = moment.utc(startTime).add(1, interval);
  }

  async.map(marketPairs, function(assetPair, asyncCallbackPair){
    var options = {
      base       : assetPair.base,
      counter    : assetPair.counter,
      start      : startTime,
      end        : endTime,
      descending : false,
      reduce     : true
    }

    var pair = {
      base    : assetPair.base,
      counter : assetPair.counter
    };

    //the section below will use
    //the previously calculated
    //vwap from the aggregated row

    /*
    if (interval) {
      options.interval = '1' + interval;
    } else {
      options.reduce   = true;
    }
    */

    hbase.getExchanges(options, function(err, resp) {
      if (err) {
        asyncCallbackPair(err);
        return;
      }

      if (options.interval) {
        resp = resp[0];
      }

      if (resp) {
        pair.rate   = resp.vwap;
        pair.count  = resp.count;
        pair.amount = resp.base_volume;

      } else {
        pair.rate   = 0;
        pair.count  = 0;
        pair.amount = 0;
      }

      asyncCallbackPair(null, pair);
    });

  }, function(err, pairs) {
    if (err) {
      if (callback) callback(err);
      return;
    }

    var finalRate;
    var rates = { };
    var response = {
      startTime    : startTime.format(),
      endTime      : endTime.format(),
      exchange     : ex,
      exchangeRate : 1,
      total        : 0,
      count        : 0
    };

    //get rates vs XRP
    pairs.forEach(function(pair, index) {
      if (pair.counter.currency === 'XRP') {
        rates[pair.base.currency + "." + pair.base.issuer] = pair.rate;
      }
    });


    //convert non - XRP to XRP value
    pairs.forEach(function(pair, index) {
      if (pair.counter.currency !== 'XRP') {
        pair.rate = rates[pair.base.currency + "." + pair.base.issuer];
      }

      pair.convertedAmount = pair.rate ? pair.amount * pair.rate : 0;
      response.total += pair.convertedAmount;
      response.count += pair.count;
    });

    response.components = pairs;

    //cache XRP normalized version
    cacheResponse (rowkey, response);

    if (ex.currency == 'XRP') {
      finalRate = 1;
    } else if (rates[ex.currency + '.' + ex.issuer]) {
      finalRate = 1 / rates[ex.currency + '.' + ex.issuer];
    }

    var options = {
      rate  : finalRate,
      start : startTime,
      end   : endTime
    };

    //finalize the response
    handleResponse(options, response, callback);
  });

  function handleResponse(options, resp, callback) {

    //normalized to XRP, nothing to do
    if (options.rate === 1) {
      callback (null, resp);

    //already have the final rate,
    //just apply it
    } else if (options.rate) {
      finalize(rate);

    //get the final rate
    } else {
      getConversion({
        startTime : options.start,
        endTime   : options.end,
        currency  : resp.exchange.currency,
        issuer    : resp.exchange.issuer

      }, function(error, finalRate) {
        if (error) {
          callback (error);
          return;
        }

        finalize(finalRate);
      });
    }

    function finalize (rate) {
      resp.total = 0;
      resp.components.forEach(function(c, index) {

        c.convertedAmount *= rate;
        c.rate      = c.rate ? rate / c.rate : 0;
        resp.total += c.convertedAmount;
      });

      resp.exchangeRate = rate;

      if (callback) {
        callback(null, resp);
      }
    }
  }

  /*
   * get XRP to specified currency conversion
   */

  function getConversion (params, callback) {

    hbase.getExchanges( {
      base    : {currency:"XRP"},
      counter : {currency:params.currency,issuer:params.issuer},
      start   : startTime,
      end     : endTime,
      reduce  : true
    }, function(err, resp) {
      if (err) {
        callback(error);
        return;
      }

      if (resp) {
        callback(null, resp.vwap); // vwavPrice
      } else {
        callback("cannot determine exchange rate");
      }
    });
  }

  function cacheResponse (rowkey, response) {
    var table = 'agg_metrics';
    hbase.putRow(table, rowkey, response);
    console.log('cacheing metric:', rowkey);
  }
}

module.exports = tradeVolume;
