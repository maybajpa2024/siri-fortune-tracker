const submitPayment = async () => {
  try {
    setLoading(true);
    
    // Build URL with parameters for GET request - with better encoding
    const params = new URLSearchParams();
    params.append('action', 'addPayment');
    params.append('password', ADMIN_PASSWORD);
    params.append('flatNumber', paymentForm.flatNumber);
    params.append('amount', paymentForm.amount);
    params.append('date', paymentForm.date);
    params.append('month', paymentForm.month);
    params.append('year', paymentForm.year);
    params.append('description', paymentForm.description);
    params.append('status', paymentForm.status);
    
    const requestUrl = `${API_URL}?${params.toString()}`;
    console.log('Sending GET request to:', requestUrl);
    console.log('Payment form data:', paymentForm);
    
    const response = await fetch(requestUrl, {
      method: 'GET'
    });
    
    const result = await response.json();
    console.log('Response from script:', result);
    
    if (result.success) {
      alert('Payment added successfully!');
      setPaymentForm({
        flatNumber: '', amount: '', date: '', month: '', year: '',
        description: 'Monthly Maintenance', status: 'Paid'
      });
      fetchAllData();
    } else {
      alert('Error: ' + (result.error || 'Failed to add payment'));
    }
  } catch (error) {
    console.error('Error details:', error);
    alert('Error adding payment: ' + error.message);
  } finally {
    setLoading(false);
  }
};
