import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from "react-native";
import Modal from "react-native-modal";

const NotesModal = ({ isVisible, onClose, onSave, initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || "");

  const close = () => {
    if (isVisible) {
      setNotes(initialNotes);
    }
    onClose();
  }

  const handleSave = () => {
    onSave(notes);
    setNotes("");
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={close}>
      <KeyboardAvoidingView 
      style={styles.keyBoardAvoidingContainer} 
      behavior="padding"
      keyboardVerticalOffset={64}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter notes"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={close}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
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
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    padding: 8,
    fontSize:20,
  },
  saveButton: {
    backgroundColor: "#007aff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    margin:5,
  },
  cancelButton: {
    backgroundColor: "grey",
    borderRadius: 8,
    paddingVertical: 12,
    margin: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NotesModal;