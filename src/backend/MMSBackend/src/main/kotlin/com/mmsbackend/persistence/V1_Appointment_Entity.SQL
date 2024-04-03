CREATE TABLE Appointment (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PT_Id_Fk INT,
    ProviderID INT,
    Name VARCHAR(255),
    Reason VARCHAR(255),
    Note TEXT,
    CreationDate DATE,
    StartTime DATETIME,
    LastUpdated DATETIME,
    StartDate DATE,
    ApptDuration INT,
    FOREIGN KEY (PT_Id_Fk) REFERENCES Patient(id)
);
