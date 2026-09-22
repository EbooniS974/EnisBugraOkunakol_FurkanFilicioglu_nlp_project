# Smart Contract Analysis

A smart contract security analysis project developed in the Department of Computer Engineering at Gebze Technical University.

The project analyzes Ethereum smart contracts by combining code-level security inspection, natural language processing, and academic literature analysis.

The main goal is to compare security practices recommended in academic research with their actual use in real-world smart contracts.

## Project Overview

The system analyzes three different types of data:

- Ethereum smart contract source code
- Project description texts
- Academic papers related to smart contract security

Smart contract code is inspected for potentially risky patterns and missing security mechanisms.

Project descriptions are analyzed using text preprocessing and rule-based classification to identify suspicious or misleading language.

Academic papers are analyzed to identify commonly discussed vulnerabilities and recommended security practices.

The results from these components are then compared to evaluate the gap between academic recommendations and real-world implementations.

## Main Features

- Ethereum smart contract code analysis
- Pattern-based vulnerability detection
- Detection of risky Solidity constructs
- Analysis of missing security mechanisms
- Natural language processing of project descriptions
- Rule-based suspicious text classification
- Academic literature analysis
- Topic analysis of smart contract security research
- Comparison between academic recommendations and deployed contracts

## Technologies

- Python
- Ethereum
- Solidity
- Natural Language Processing (NLP)
- Rule-Based Classification
- Pattern-Based Code Analysis
- Text Preprocessing
- Topic Modeling

## System Architecture

```text
Data Collection
      ↓
--------------------------------
| Smart Contract Source Code   |
| Project Description Texts    |
| Academic Security Articles   |
--------------------------------
      ↓
Analysis Layer
      ↓
--------------------------------
| Code Security Analysis       |
| NLP / Text Analysis          |
| Literature Analysis          |
--------------------------------
      ↓
Comparison
      ↓
Academic Recommendations
vs.
Real-World Implementations
