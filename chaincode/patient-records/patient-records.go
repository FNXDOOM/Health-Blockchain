package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// PatientRecord represents a medical record in the world state
type PatientRecord struct {
	ID              string    `json:"id"`
	PatientID       string    `json:"patientId"`
	DoctorID        string    `json:"doctorId"`
	RecordType      string    `json:"recordType"`
	Description     string    `json:"description"`
	Diagnosis       string    `json:"diagnosis"`
	Treatment       string    `json:"treatment"`
	Medications     []string  `json:"medications"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
	EncryptedData   string    `json:"encryptedData"`
	AccessControl   []string  `json:"accessControl"`
	EmergencyAccess bool      `json:"emergencyAccess"`
}

// Patient represents a patient in the world state
type Patient struct {
	ID              string    `json:"id"`
	Name            string    `json:"name"`
	DateOfBirth     string    `json:"dateOfBirth"`
	Gender          string    `json:"gender"`
	ContactInfo     string    `json:"contactInfo"`
	BloodGroup      string    `json:"bloodGroup"`
	Allergies       []string  `json:"allergies"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
	PublicKey       string    `json:"publicKey"`
	EmergencyAccess []string  `json:"emergencyAccess"`
}

// SmartContract provides functions for managing patient records
type SmartContract struct {
	contractapi.Contract
}

// InitLedger adds a base set of records to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// This function can be used to initialize the ledger with some sample data if needed
	return nil
}

// CreatePatient issues a new patient to the world state with given details
func (s *SmartContract) CreatePatient(ctx contractapi.TransactionContextInterface, id string, name string, dateOfBirth string, gender string, contactInfo string, bloodGroup string, allergies []string, publicKey string) error {
	exists, err := s.PatientExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the patient %s already exists", id)
	}

	currentTime := time.Now()
	patient := Patient{
		ID:              id,
		Name:            name,
		DateOfBirth:     dateOfBirth,
		Gender:          gender,
		ContactInfo:     contactInfo,
		BloodGroup:      bloodGroup,
		Allergies:       allergies,
		CreatedAt:       currentTime,
		UpdatedAt:       currentTime,
		PublicKey:       publicKey,
		EmergencyAccess: []string{},
	}

	patientJSON, err := json.Marshal(patient)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, patientJSON)
}

// CreatePatientRecord issues a new medical record to the world state with given details
func (s *SmartContract) CreatePatientRecord(ctx contractapi.TransactionContextInterface, id string, patientID string, doctorID string, recordType string, description string, diagnosis string, treatment string, medications []string, encryptedData string, accessControl []string) error {
	exists, err := s.PatientRecordExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the record %s already exists", id)
	}

	// Check if patient exists
	patientExists, err := s.PatientExists(ctx, patientID)
	if err != nil {
		return err
	}
	if !patientExists {
		return fmt.Errorf("the patient %s does not exist", patientID)
	}

	currentTime := time.Now()
	record := PatientRecord{
		ID:              id,
		PatientID:       patientID,
		DoctorID:        doctorID,
		RecordType:      recordType,
		Description:     description,
		Diagnosis:       diagnosis,
		Treatment:       treatment,
		Medications:     medications,
		CreatedAt:       currentTime,
		UpdatedAt:       currentTime,
		EncryptedData:   encryptedData,
		AccessControl:   accessControl,
		EmergencyAccess: false,
	}

	recordJSON, err := json.Marshal(record)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, recordJSON)
}

// QueryPatient returns the patient stored in the world state with given id
func (s *SmartContract) QueryPatient(ctx contractapi.TransactionContextInterface, id string) (*Patient, error) {
	patientJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if patientJSON == nil {
		return nil, fmt.Errorf("the patient %s does not exist", id)
	}

	var patient Patient
	err = json.Unmarshal(patientJSON, &patient)
	if err != nil {
		return nil, err
	}

	return &patient, nil
}

// QueryPatientRecord returns the medical record stored in the world state with given id
func (s *SmartContract) QueryPatientRecord(ctx contractapi.TransactionContextInterface, id string) (*PatientRecord, error) {
	recordJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if recordJSON == nil {
		return nil, fmt.Errorf("the record %s does not exist", id)
	}

	var record PatientRecord
	err = json.Unmarshal(recordJSON, &record)
	if err != nil {
		return nil, err
	}

	return &record, nil
}

// QueryPatientRecordsByPatient returns all medical records for a specific patient
func (s *SmartContract) QueryPatientRecordsByPatient(ctx contractapi.TransactionContextInterface, patientID string) ([]*PatientRecord, error) {
	queryString := fmt.Sprintf(`{"selector":{"patientId":"%s"}}`, patientID)
	return getQueryResultForQueryString(ctx, queryString)
}

// UpdatePatientRecord updates an existing record in the world state with provided parameters
func (s *SmartContract) UpdatePatientRecord(ctx contractapi.TransactionContextInterface, id string, description string, diagnosis string, treatment string, medications []string, encryptedData string, accessControl []string) error {
	record, err := s.QueryPatientRecord(ctx, id)
	if err != nil {
		return err
	}

	// Update the record with new values
	record.Description = description
	record.Diagnosis = diagnosis
	record.Treatment = treatment
	record.Medications = medications
	record.EncryptedData = encryptedData
	record.AccessControl = accessControl
	record.UpdatedAt = time.Now()

	recordJSON, err := json.Marshal(record)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, recordJSON)
}

// GrantEmergencyAccess grants emergency access to a patient's records
func (s *SmartContract) GrantEmergencyAccess(ctx contractapi.TransactionContextInterface, patientID string, emergencyProviderID string) error {
	patient, err := s.QueryPatient(ctx, patientID)
	if err != nil {
		return err
	}

	// Add emergency provider to the emergency access list if not already present
	for _, provider := range patient.EmergencyAccess {
		if provider == emergencyProviderID {
			return nil // Provider already has emergency access
		}
	}

	patient.EmergencyAccess = append(patient.EmergencyAccess, emergencyProviderID)
	patient.UpdatedAt = time.Now()

	patientJSON, err := json.Marshal(patient)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(patientID, patientJSON)
}

// RevokeEmergencyAccess revokes emergency access from a provider
func (s *SmartContract) RevokeEmergencyAccess(ctx contractapi.TransactionContextInterface, patientID string, emergencyProviderID string) error {
	patient, err := s.QueryPatient(ctx, patientID)
	if err != nil {
		return err
	}

	// Remove emergency provider from the emergency access list
	updatedEmergencyAccess := []string{}
	for _, provider := range patient.EmergencyAccess {
		if provider != emergencyProviderID {
			updatedEmergencyAccess = append(updatedEmergencyAccess, provider)
		}
	}

	patient.EmergencyAccess = updatedEmergencyAccess
	patient.UpdatedAt = time.Now()

	patientJSON, err := json.Marshal(patient)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(patientID, patientJSON)
}

// PatientExists returns true when patient with given ID exists in world state
func (s *SmartContract) PatientExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	patientJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return patientJSON != nil, nil
}

// PatientRecordExists returns true when record with given ID exists in world state
func (s *SmartContract) PatientRecordExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	recordJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return recordJSON != nil, nil
}

// Helper function for querying records based on a query string
func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*PatientRecord, error) {
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var records []*PatientRecord
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var record PatientRecord
		err = json.Unmarshal(queryResponse.Value, &record)
		if err != nil {
			return nil, err
		}
		records = append(records, &record)
	}

	return records, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		fmt.Printf("Error creating patient records chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting patient records chaincode: %s", err.Error())
	}
}