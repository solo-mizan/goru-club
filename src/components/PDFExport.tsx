'use client';

import { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 40
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        marginBottom: 20
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#bfbfbf',
        borderBottomStyle: 'solid'
    },
    tableHeaderCell: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
        padding: 8,
        fontSize: 12
    },
    tableCell: {
        padding: 8,
        fontSize: 10
    },
    nameColumn: {
        width: '50%'
    },
    phoneColumn: {
        width: '25%'
    },
    depositColumn: {
        width: '25%'
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 10,
        color: '#666'
    }
});

// PDF Document Structure
const MembersReport = ({ members }: { members: any[] }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Hamba Village Union</Text>
            <Text style={styles.subtitle}>Members Deposit Report</Text>
            <Text style={{ fontSize: 10, marginBottom: 10 }}>Generated on: {new Date().toLocaleDateString()}</Text>

            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableHeaderCell, styles.nameColumn]}>
                        <Text>Member Name</Text>
                    </View>
                    <View style={[styles.tableHeaderCell, styles.phoneColumn]}>
                        <Text>Phone Number</Text>
                    </View>
                    <View style={[styles.tableHeaderCell, styles.depositColumn]}>
                        <Text>Total Deposit</Text>
                    </View>
                </View>

                {/* Table Rows */}
                {members.map((member) => (
                    <View style={styles.tableRow} key={member._id}>
                        <View style={[styles.tableCell, styles.nameColumn]}>
                            <Text>{member.name}</Text>
                        </View>
                        <View style={[styles.tableCell, styles.phoneColumn]}>
                            <Text>{member.phoneNumber}</Text>
                        </View>
                        <View style={[styles.tableCell, styles.depositColumn]}>
                            <Text>৳ {member.totalDeposit.toFixed(2)}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Total */}
            <View style={{ marginTop: 10, marginBottom: 30 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                    Total Deposits: ৳ {members.reduce((sum, member) => sum + member.totalDeposit, 0).toFixed(2)}
                </Text>
            </View>

            <Text style={styles.footer}>© {new Date().getFullYear()} Hamba Village Union. All rights reserved.</Text>
        </Page>
    </Document>
);

export function PDFExport() {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchMembersData = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/members/with-deposits');
            if (!response.ok) {
                throw new Error('Failed to fetch members data');
            }

            const data = await response.json();
            setMembers(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching members data:', err);
            setError('Failed to load data for export. Please try again.');
            setLoading(false);
        }
    };

    // Trigger data fetch when button is clicked
    const handleClick = () => {
        if (members.length === 0) {
            fetchMembersData();
        }
    };

    return (
        <>
            {!loading && members.length > 0 ? (
                <PDFDownloadLink
                    document={<MembersReport members={members} />}
                    fileName="hamba_members_report.pdf"
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                >
                    {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF Report')}
                </PDFDownloadLink>
            ) : (
                <button
                    onClick={handleClick}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Loading data...' : 'Generate PDF Report'}
                </button>
            )}

            {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
        </>
    );
} 