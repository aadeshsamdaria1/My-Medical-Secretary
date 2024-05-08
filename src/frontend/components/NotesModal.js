import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

const NotesModal = ({ isVisible, onClose, onSave, initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || "");

  const handleSave = () => {
    onSave(notes);
    setNotes("");
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter notes"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  notesInput: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    padding: 8,
  },
  saveButton: {
    backgroundColor: "#007aff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NotesModal;