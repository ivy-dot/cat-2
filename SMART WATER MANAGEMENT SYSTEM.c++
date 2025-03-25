#include <iostream>
#include <fstream>
#include <string>
#include <ctime>

using namespace std;

// Structure to store water usage data
struct WaterUsage {
    string date;
    double usage; // Water usage in liters
};

// Function to get the current date as a string
string getCurrentDate() {
    time_t now = time(0);
    tm *ltm = localtime(&now);
    string date = to_string(1900 + ltm->tm_year) + "-" + to_string(1 + ltm->tm_mon) + "-" + to_string(ltm->tm_mday);
    return date;
}

// Function to log water usage
void logWaterUsage(double liters) {
    ofstream file("water_usage.txt", ios::app); // Append to file
    if (file.is_open()) {
        file << getCurrentDate() << " " << liters << endl;
        file.close();
        cout << "Water usage logged successfully.\n";
    } else {
        cout << "Error: Unable to open file.\n";
    }
}

// Function to check for excessive water usage
void detectAnomalies() {
    ifstream file("water_usage.txt");
    string date;
    double usage, totalUsage = 0;
    int count = 0;
    
    if (file.is_open()) {
        while (file >> date >> usage) {
            totalUsage += usage;
            count++;
        }
        file.close();
        
        // Calculate average usage
        double avgUsage = (count > 0) ? (totalUsage / count) : 0;
        
        // Set threshold (example: 1.5 times the average usage)
        double threshold = avgUsage * 1.5;

        cout << "Average Daily Usage: " << avgUsage << " liters\n";
        cout << "Leak Detection Threshold: " << threshold << " liters\n";

        if (totalUsage > threshold) {
            cout << "Alert: Possible leak detected! Unusual water consumption observed.\n";
        } else {
            cout << "Water consumption is normal.\n";
        }
    } else {
        cout << "Error: Unable to read water usage data.\n";
    }
}

// Main menu function
void menu() {
    int choice;
    double liters;
    
    do {
        cout << "\nSmart Water Management System\n";
        cout << "1. Log Water Usage\n";
        cout << "2. Detect Anomalies\n";
        cout << "3. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;
        
        switch (choice) {
            case 1:
                cout << "Enter water usage in liters: ";
                cin >> liters;
                logWaterUsage(liters);
                break;
            case 2:
                detectAnomalies();
                break;
            case 3:
                cout << "Exiting program...\n";
                break;
            default:
                cout << "Invalid choice! Please try again.\n";
        }
    } while (choice != 3);
}
int main() {
    menu();
    return 0;
}
