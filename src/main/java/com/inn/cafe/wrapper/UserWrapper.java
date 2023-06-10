package com.inn.cafe.wrapper;

import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor

// we are creating this wrapper class because it wont expose the password if we directly use the userclass object it will also return the password aswell
public class UserWrapper {
    private  Integer id;
    private String name;
    private String  email;
    private String contactNumber;
    private String status;

    public UserWrapper(Integer id, String name, String email, String contactNumber, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contactNumber = contactNumber;
        this.status = status;
    }
}
