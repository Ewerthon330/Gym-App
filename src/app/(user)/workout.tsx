import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WorkoutScreen() {
  
  
  return (
    <View>
      <ScrollView style={styles.container}>
            {/* Header com horário */}
            <View style={styles.header}>
              <Text style={styles.time}>9:41</Text>
            </View>
      
            {/* Seção Attna */}
            <View style={styles.attnaSection}>
              <Text style={styles.sectionTitle}>Attna</Text>
              <View style={styles.attnaItems}>
                <Text style={styles.attnaItem}>• Intermedia</Text>
                <Text style={styles.attnaItem}>• We have new catalogs!</Text>
              </View>
            </View>
      
            {/* Divisor */}
            <View style={styles.divider} />
      
            {/* Seção 200 days */}
            <View style={styles.daysSection}>
              <Text style={styles.daysText}>200 days</Text>
              <Text style={styles.signatureText}>SIGNATURE</Text>
            </View>
      
            {/* Tabela Full Range */}
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Full Range</Text>
                <Text style={styles.tableHeaderText}>Large</Text>
                <Text style={styles.tableHeaderText}>Manual</Text>
                <Text style={styles.tableHeaderText}>Проект</Text>
              </View>
              
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutTitle}>Suggested Workout</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
            </View>
      
            {/* Lista de exercícios */}
            <View style={styles.exercisesContainer}>
              <View style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>• Bridge:</Text>
                <Text style={styles.exerciseDetail}>2 Tunnels, - 30 Minutes</Text>
              </View>
              
              <View style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>• Push up:</Text>
                <Text style={styles.exerciseDetail}>12 Tunnels, - 60 Minutes</Text>
              </View>
              
              <View style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>• Hin Trend:</Text>
                <Text style={styles.exerciseDetail}>10 Tunnels, - 45 Minutes</Text>
              </View>
            </View>
          </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  attnaSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  attnaItems: {
    marginLeft: 8,
  },
  attnaItem: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  daysSection: {
    marginBottom: 24,
  },
  daysText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  signatureText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
  tableContainer: {
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    flex: 1,
    textAlign: 'center',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  exercisesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  exerciseName: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#666666',
  },
});

