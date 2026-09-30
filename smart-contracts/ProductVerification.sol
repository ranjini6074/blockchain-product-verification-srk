// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductVerification {
    struct ProductRecord {
        string productCode;
        string productName;
        string batchNumber;
        string expiryDate;
        string hashValue;
        bool exists;
    }

    mapping(string => ProductRecord) public products;

    event ProductRegistered(
        string productCode,
        string productName,
        string batchNumber,
        string expiryDate,
        string hashValue
    );

    function registerProduct(
        string memory _productCode,
        string memory _productName,
        string memory _batchNumber,
        string memory _expiryDate,
        string memory _hashValue
    ) public {
        require(!products[_productCode].exists, "Product already exists");

        products[_productCode] = ProductRecord({
            productCode: _productCode,
            productName: _productName,
            batchNumber: _batchNumber,
            expiryDate: _expiryDate,
            hashValue: _hashValue,
            exists: true
        });

        emit ProductRegistered(
            _productCode,
            _productName,
            _batchNumber,
            _expiryDate,
            _hashValue
        );
    }

    function verifyProduct(string memory _productCode, string memory _hashValue)
        public
        view
        returns (bool)
    {
        if (!products[_productCode].exists) {
            return false;
        }

        return keccak256(bytes(products[_productCode].hashValue)) ==
            keccak256(bytes(_hashValue));
    }
}
